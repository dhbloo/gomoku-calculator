import { Engine, EngineState } from './engine';
import { resolve, dirname } from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

export class NodeLocalEngine extends Engine {
  private enginePath: string;
  private engineArgs: string[];
  private engineProcess: ChildProcessWithoutNullStreams | null;
  private state: EngineState;
  private onStdout: (line: string) => void;
  private onStderr: (line: string) => void;

  constructor(enginePath: string, engineArgs: string[] = []) {
    super();
    this.enginePath = resolve(enginePath);
    this.engineArgs = engineArgs;
    this.engineProcess = null;
    this.state = EngineState.Uninitialized;
    this.onStdout = (line: string) => console.log(line);
    this.onStderr = (line: string) => console.error(line);
  }

  init(onInitialized?: () => void): void {
    this.state = EngineState.Initializing;
    const spawnOptions = {
      cwd: dirname(this.enginePath),
      windowsHide: true,
    };
    this.engineProcess = spawn(this.enginePath, this.engineArgs, spawnOptions);
    this.engineProcess.on('spawn', () => {
      this.state = EngineState.Alive;
      if (onInitialized) onInitialized();
    });
    this.engineProcess.on('close', () => {
      this.state = EngineState.Dead;
    });
    this.engineProcess.stdout.on('data', (data: Buffer) => {
      this.onStdout(data.toString());
    });
    this.engineProcess.stderr.on('data', (data: Buffer) => {
      this.onStderr(data.toString());
    });
  }

  getState(): EngineState {
    return this.state;
  }

  kill(): void {
    this.engineProcess?.kill();
  }

  sendLine(line: string): void {
    if (this.state !== EngineState.Alive) return;
    this.engineProcess?.stdin.write(line + '\n');
  }

  listenStdout(callback: (line: string) => void): void {
    this.onStdout = callback;
  }

  listenStderr(callback: (line: string) => void): void {
    this.onStderr = callback;
  }
}
