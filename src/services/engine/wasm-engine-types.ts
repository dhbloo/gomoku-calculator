export interface RapfiWasmInterface {
  /**
   * Send a command to the engine.
   * @param command One line of command to send to the engine.
   * @remarks
   * This command will block until the engine finishes processing
   * the command. When the engine runs in multi-threaded mode, this
   * method typically will not block during thinking. However, when
   * the engine runs in single-threaded mode, this method will block
   * until the engine finishes thinking.
   */
  sendCommand(command: string): void;

  /**
   * Terminate the engine instance.
   * @remarks
   * This method will stop the engine instance immediately and
   * release all resources. After this method is called, the
   * engine runtime is no longer usable.
   */
  terminate(): void;
}

export interface WasmWorkerMessage {
  init?: {
    engineURL: string;
    memoryArgs?: {
      initial: number;
      maximum: number;
    };
  };
  command?: string;
}

export interface WasmWorkerResponse {
  stdout?: string;
  stderr?: string;
  ready?: boolean;
  exit?: number;
  status?: string;
}
