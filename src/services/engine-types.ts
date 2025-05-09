import { Move } from './game-types';

export interface TimeControl {
  turnTime?: number;
  matchTime?: number;
  depth?: number;
  nodes?: number;
}

export interface PVInfo {
  pv: Move[];
  index: number | null;
  depth: number;
  seldepth: number;
  nodes: number;
  totalNodes: number;
  totalTime: number;
  eval: string;
  winrate: number;
  status: null | 'searching' | 'searched' | 'lost' | 'best';
}

export type MultiPVInfo = Map<Move, PVInfo>;
