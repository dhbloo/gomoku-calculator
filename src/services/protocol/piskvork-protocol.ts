import { Engine } from '../engine/engine';
import { makeCoord, Coord } from '../game-types';

/**
 * Piskvork/Gomocup protocol adaptor.
 * @remarks
 * This protocol adaptor is designed for the Piskvork protocol with
 * Yixin-Board extension and Rapfi's information output format.
 * Piskvork specification: https://plastovicka.github.io/protocl2en.htm
 * Yixin-Board extension: https://github.com/accreator/Yixin-protocol
 */
export class PiskvorkProtocol {
  protected callbacks: {
    [key: string]: ((result: unknown) => void) | undefined;
  };
  protected infoBuffer: {
    pvidx?: number;
    numpv?: number;
    depth?: number;
    seldepth?: number;
    nodes?: number;
    totalnodes?: number;
    totaltime?: number;
    speed?: number;
    eval?: string;
    winrate?: number;
    bestline?: Coord[];
  };

  /**
   * Construct a protocol adaptor from an engine instance.
   * @param engine Engine instance that supports stdin/stdout communication.
   */
  constructor(protected engine: Engine) {
    this.engine.listenStdout(this.onStdout);
    this.engine.listenStderr(this.onStderr);
    this.callbacks = {
      stdout: undefined,
      stderr: undefined,
      startok: undefined,
      error: undefined,
      bestmove: undefined,
      swap: undefined,
      message: undefined,
      realtime: undefined,
      info: undefined,
      forbid: undefined,
    };
    this.infoBuffer = {};
  }

  protected onStdout = (line: string): void => {
    line = line.trim();
    this.callbacks.stdout?.(line);

    const firstSpace = line.indexOf(' ');
    const cmd = firstSpace === -1 ? line : line.slice(0, firstSpace);
    const tail = firstSpace === -1 ? '' : line.slice(firstSpace + 1);

    switch (cmd) {
      case 'INFO': {
        const firstSpace = tail.indexOf(' ');
        const head = tail.slice(0, firstSpace);
        const rest = tail.slice(firstSpace + 1);
        switch (head) {
          case 'PV':
            if (rest == 'DONE') this.callbacks.info?.(this.infoBuffer);
            else this.infoBuffer.pvidx = parseInt(rest);
            break;
          case 'NUMPV':
            this.infoBuffer.numpv = parseInt(rest);
            break;
          case 'DEPTH':
            this.infoBuffer.depth = parseInt(rest);
            break;
          case 'SELDEPTH':
            this.infoBuffer.seldepth = parseInt(rest);
            break;
          case 'NODES':
            this.infoBuffer.nodes = parseInt(rest);
            break;
          case 'TOTALNODES':
            this.infoBuffer.totalnodes = parseInt(rest);
            break;
          case 'TOTALTIME':
            this.infoBuffer.totaltime = parseInt(rest);
            break;
          case 'SPEED':
            this.infoBuffer.speed = parseInt(rest);
            break;
          case 'EVAL':
            this.infoBuffer.eval = rest;
            break;
          case 'WINRATE':
            this.infoBuffer.winrate = parseFloat(rest);
            break;
          case 'BESTLINE':
            this.infoBuffer.bestline = (rest.match(/([A-Z]\d+)/g) || []).map(
              (s: string) => {
                const x = s.charCodeAt(0) - 'A'.charCodeAt(0);
                const y = parseInt(s.substring(1)) - 1;
                return makeCoord(x, y);
              }
            );
            break;
          default:
            console.error('Unknown INFO head:', head);
        }
      }
      case 'MESSAGE':
        if (tail.startsWith('REALTIME')) {
          const parts = tail.split(' ');
          if (parts.length < 3) {
            this.callbacks.realtime?.({ type: parts[1] });
          } else {
            const coord = parts.slice(2).map((x) => parseInt(x));
            this.callbacks.realtime?.({
              type: parts[1],
              coord: makeCoord(coord[0], coord[1]),
            });
          }
        } else this.callbacks.message?.(tail);
        break;
      case 'ERROR':
        this.callbacks.error?.(tail);
        break;
      case 'OK':
        this.callbacks.startok?.(null);
        break;
      case 'SWAP':
        this.callbacks.swap?.(null);
        break;
      case 'FORBID':
        this.callbacks.forbid?.(
          (tail.match(/.{4}/g) || [])
            .map((s) => {
              const coord = s.match(/([0-9][0-9])([0-9][0-9])/);
              return coord ? makeCoord(+coord[1], +coord[2]) : null;
            })
            .filter((x) => x !== null)
        );
        break;
      default: {
        if (cmd) {
          const coord = cmd.split(',').map((x) => parseInt(x));
          this.callbacks.bestmove?.(makeCoord(coord[0], coord[1]));
        }
      }
    }
  };

  protected onStderr = (line: string): void => {
    console.error('Error:', line);
  };

  public registerCallback(
    name: string,
    callback: (result: unknown) => void
  ): void {
    this.callbacks[name] = callback;
  }

  public start(boardSize: number): void {
    this.engine.sendLine(`START ${boardSize}`);
  }
}
