/**
 * Engine state for representing the engine's current status.
 */
export enum EngineState {
  Uninitialized,
  Initializing,
  Alive,
  Dead,
}

/**
 * Abstract class for an engine interface.
 */
export abstract class Engine {
  /**
   * Init the engine instance (start the engine process, etc.)
   * @remarks The engine is expected to be ready to receive
   * commands, after onInitialized() is called.
   */
  abstract init(onInitialized?: () => void): void;

  /**
   * Acquire the current engine state.
   */
  abstract getState(): EngineState;

  /**
   * Stop the engine process forcefully.
   * @remarks The engine is expected to be in Dead state, after
   * this method is called. This method should be non-blocking.
   */
  abstract kill(): void;

  /**
   * Send a line of raw command to the engine.
   * @remarks Only works when the engine is in Alive state.
   */
  abstract sendLine(line: string): void;

  /**
   * Register a callback when received a line from the stdout.
   */
  abstract listenStdout(callback: (line: string) => void): void;

  /**
   * Register a callback when received a line from the stderr.
   */
  abstract listenStderr(callback: (line: string) => void): void;
}
