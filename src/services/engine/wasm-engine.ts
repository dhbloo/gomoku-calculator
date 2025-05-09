import { Engine, EngineState } from './engine';
import { RapfiWasmInterface, WasmWorkerResponse } from './wasm-engine-types';
import SingleThreadEngineWorker from './wasm-engine-singlethread.worker?worker';

declare const Rapfi: (args: object) => Promise<RapfiWasmInterface>;

/**
 * SIMD type for the engine.
 */
enum EngineSimdType {
  NoSimd,
  Simd128,
  Simd128Relaxed,
}

/**
 * Base name for the WebAssembly engine.
 */
const EngineName = 'rapfi';

/**
 * Get the URL of the WebAssembly engine's js file.
 * @param multiThreading Whether to use multi-threading.
 * @param simdType SIMD type for the engine.
 */
function getEngineURL(multiThreading: boolean, simdType: EngineSimdType) {
  let baseName = EngineName;
  baseName += multiThreading ? '-multi' : '-single';
  switch (simdType) {
    case EngineSimdType.Simd128:
      baseName += '-simd128';
      break;
    case EngineSimdType.Simd128Relaxed:
      baseName += '-simd128-relaxed';
      break;
    default:
      break;
  }
  return `build/${baseName}.js`;
}

/**
 * Get the memory arguments for the WebAssembly engine.
 * @param isShared Whether to use shared memory.
 */
function getWasmMemoryArguments(isShared: boolean) {
  return {
    initial: 128 * ((1024 * 1024) / 65536), // 128MB
    maximum: 1024 * ((1024 * 1024) / 65536), // 1GB
    shared: isShared,
  };
}

/**
 * Engine implementation for a single-threaded WebAssembly engine.
 * This engine runs in a worker thread so it can be interrupted at
 * any time when requested by the main thread.
 *
 * @remarks
 * This engine can be used when SharedArrayBuffer is not available.
 */
export class WasmSingleThreadEngine extends Engine {
  private engineURL: string;
  private worker: Worker | undefined;
  private state: EngineState;
  private onStdout: (line: string) => void;
  private onStderr: (line: string) => void;

  constructor(
    simdType: EngineSimdType,
    private onFetchProgress?: (loaded: number, total: number) => void,
    private onFetchFinished?: () => void
  ) {
    super();
    this.engineURL = getEngineURL(false, simdType);
    this.worker = undefined;
    this.state = EngineState.Uninitialized;
    this.onStdout = () => undefined;
    this.onStderr = () => undefined;
  }

  init(onInitialized?: () => void): void {
    this.worker = new SingleThreadEngineWorker();
    this.worker.onmessage = (event: MessageEvent) => {
      const message = event.data as WasmWorkerResponse;
      if (message.ready) {
        this.state = EngineState.Alive;
        if (onInitialized) onInitialized();
      } else if (message.stdout) {
        this.onStdout(message.stdout);
      } else if (message.stderr) {
        this.onStderr(message.stderr);
      } else if (message.status) {
        if (message.status.startsWith('Downloading data... (')) {
          if (this.onFetchProgress) {
            const progressStr = message.status.split('(')[1].split(')')[0];
            const [loadedStr, totalStr] = progressStr.split('/');
            this.onFetchProgress(parseInt(loadedStr), parseInt(totalStr));
          }
        } else if (message.status == 'Running...') {
          if (this.onFetchFinished) this.onFetchFinished();
        }
      } else if (message.exit !== undefined) {
        this.state = EngineState.Dead;
      }
    };
    this.worker.onerror = (event: ErrorEvent) => {
      console.error('Engine worker error:', event.error, event.message);
      this.state = EngineState.Dead;
      console.warn('Restarting the engine worker after 500ms...');
      setTimeout(() => this.init(onInitialized), 500);
    };
    this.state = EngineState.Initializing;
    this.worker.postMessage({
      init: {
        engineURL: this.engineURL,
        memoryArgs: getWasmMemoryArguments(false),
      },
    });
  }

  getState(): EngineState {
    return this.state;
  }

  kill(): void {
    this.worker?.terminate();
    this.state = EngineState.Dead;
  }

  sendLine(line: string): void {
    if (this.state !== EngineState.Alive) return;
    this.worker?.postMessage({
      command: line,
    });
  }

  listenStdout(callback: (line: string) => void): void {
    this.onStdout = callback;
  }

  listenStderr(callback: (line: string) => void): void {
    this.onStderr = callback;
  }
}

/**
 * Engine implementation for a multi-threaded WebAssembly engine.
 *
 * @remarks
 * This engine can only be used when SharedArrayBuffer is available.
 */
export class WasmMultiThreadEngine extends Engine {
  private engineURL: string;
  private engineInstance: RapfiWasmInterface | undefined;
  private state: EngineState;
  private onStdout: (line: string) => void;
  private onStderr: (line: string) => void;

  constructor(
    simdType: EngineSimdType,
    private onFetchProgress?: (loaded: number, total: number) => void,
    private onFetchFinished?: () => void
  ) {
    super();
    this.engineURL = getEngineURL(false, simdType);
    this.engineInstance = undefined;
    this.state = EngineState.Uninitialized;
    this.onStdout = () => undefined;
    this.onStderr = () => undefined;
  }

  init(onInitialized?: () => void): void {
    this.state = EngineState.Initializing;
    import(this.engineURL)
      .then(() => {
        const engineArgs = {
          onReceiveStdout: (line: string) => this.onStdout(line),
          onReceiveStderr: (line: string) => this.onStderr(line),
          onExit: () => (this.state = EngineState.Dead),
          setStatus: (status: string) => {
            if (status.startsWith('Downloading data... (')) {
              if (this.onFetchProgress) {
                const progressStr = status.split('(')[1].split(')')[0];
                const [loadedStr, totalStr] = progressStr.split('/');
                this.onFetchProgress(parseInt(loadedStr), parseInt(totalStr));
              }
            } else if (status == 'Running...') {
              if (this.onFetchFinished) this.onFetchFinished();
            }
          },
          wasmMemory: new WebAssembly.Memory(getWasmMemoryArguments(true)),
        };
        Rapfi(engineArgs)
          .then((e: RapfiWasmInterface) => {
            this.engineInstance = e;
            this.state = EngineState.Alive;
            if (onInitialized) onInitialized();
          })
          .catch((err: Error) => console.error('Failed to init engine:', err));
      })
      .catch((err) => {
        console.error(console.error('Failed to load engine:', err));
      });
  }

  getState(): EngineState {
    return this.state;
  }

  kill(): void {
    try {
      this.engineInstance?.terminate();
    } catch (e) {}
    this.state = EngineState.Dead;
  }

  sendLine(line: string): void {
    this.engineInstance?.sendCommand(line);
  }

  listenStdout(callback: (line: string) => void): void {
    this.onStdout = callback;
  }

  listenStderr(callback: (line: string) => void): void {
    this.onStderr = callback;
  }
}
