/// <reference lib="webworker" />
import { RapfiWasmInterface, WasmWorkerMessage } from './wasm-engine-types';

declare const Rapfi: (args: object) => Promise<RapfiWasmInterface>;
const worker = self as DedicatedWorkerGlobalScope;
let engine: RapfiWasmInterface | null = null;

worker.onmessage = (event: MessageEvent) => {
  const message = event.data as WasmWorkerMessage;
  if (message.command) {
    if (engine) engine.sendCommand(message.command);
    else
      console.error(
        'Engine worker received command when the engine is not ready yet'
      );
  } else if (message.init) {
    worker.importScripts(message.init.engineURL);
    const engineArgs = {
      onReceiveStdout: (line: string) => self.postMessage({ stdout: line }),
      onReceiveStderr: (line: string) => self.postMessage({ stderr: line }),
      onExit: (code: number) => self.postMessage({ exit: code }),
      setStatus: (s: string) => self.postMessage({ status: s }),
      wasmMemory: message.init.memoryArgs
        ? new WebAssembly.Memory(message.init.memoryArgs)
        : undefined,
    };
    Rapfi(engineArgs)
      .then((e: RapfiWasmInterface) => {
        engine = e;
        self.postMessage({ ready: true });
      })
      .catch((err: Error) => console.error('Failed to init engine:', err));
  } else {
    console.error('Engine worker received unknown message', message);
  }
};
