// ------------------------------------------------------------------
// Game related types and constants

export enum Color {
  Black = 0,
  White = 1,
  Empty = 2,
}

export function opposite(color: Color) {
  switch (color) {
    case Color.Black:
      return Color.White;
    case Color.White:
      return Color.Black;
    default:
      return color;
  }
}

export type Coord = number;

export function makeCoord(x: number, y: number) {
  return (y << 5) | x;
}

export function unpackCoord(coord: Coord) {
  return [coord & 31, coord >> 5] as [number, number];
}

export function coordToIndex(coord: Coord, boardSize: number) {
  const [x, y] = unpackCoord(coord);
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return -1;
  return y * boardSize + x;
}

export function isInBoard(coord: Coord, boardSize: number) {
  return coordToIndex(coord, boardSize) != -1;
}

export enum Symmetry {
  Identity = 0,
  Rotate90 = 1,
  Rotate180 = 2,
  Rotate270 = 3,
  FlipX = 4,
  FlipY = 5,
  FlipXY = 6,
  FlipYX = 7,
}

export function applySymmetry(coord: Coord, boardSize: number, sym: Symmetry) {
  const [x, y] = unpackCoord(coord);
  const sx = boardSize - 1;
  const sy = boardSize - 1;
  switch (sym) {
    case Symmetry.Rotate90:
      return makeCoord(y, sy - x);
    case Symmetry.Rotate180:
      return makeCoord(sx - x, sy - y);
    case Symmetry.Rotate270:
      return makeCoord(sx - y, x);
    case Symmetry.FlipX:
      return makeCoord(x, sy - y);
    case Symmetry.FlipY:
      return makeCoord(sx - x, y);
    case Symmetry.FlipXY:
      return makeCoord(y, x);
    case Symmetry.FlipYX:
      return makeCoord(sx - y, sy - x);
    default:
      return coord;
  }
}

export enum Direction {
  Up = -32,
  Left = -1,
  Right = 1,
  Down = 32,

  UpLeft = Up + Left,
  UpRight = Up + Right,
  DownLeft = Down + Left,
  DownRight = Down + Right,
}

export type Move = Coord | 'pass';

export function moveToString(move: Move, upperCase = false) {
  if (move == 'pass') return '--';
  const [x, y] = unpackCoord(move as Coord);
  const baseCharCode = (upperCase ? 'A' : 'a').charCodeAt(0);
  return `${String.fromCharCode(baseCharCode + x)}${1 + y}`;
}

export function parseMove(str: string) {
  if (str == '--') return 'pass';
  str = str.toLowerCase();
  const x = str.charCodeAt(0) - 'a'.charCodeAt(0);
  const y = parseInt(str.slice(1)) - 1;
  return makeCoord(x, y);
}

// ------------------------------------------------------------------
// Rule related types and constants

export enum BasicRule {
  Freestyle = 0,
  Standard = 1,
  Renju = 2,
}

export enum GameRule {
  FreestyleFreeOpen = 0,
  StandardFreeOpen = 1,
  RenjuFreeOpen = 2,
  FreestyleSwap1 = 5,
}

export function getBasicRule(rule: GameRule) {
  switch (rule) {
    case GameRule.FreestyleFreeOpen:
    case GameRule.FreestyleSwap1:
      return BasicRule.Freestyle;
    case GameRule.StandardFreeOpen:
      return BasicRule.Standard;
    case GameRule.RenjuFreeOpen:
      return BasicRule.Renju;
  }
}

export function getRuleName(rule: GameRule) {
  switch (rule) {
    case GameRule.FreestyleFreeOpen:
      return 'Freestyle (free opening)';
    case GameRule.StandardFreeOpen:
      return 'Standard (free opening)';
    case GameRule.RenjuFreeOpen:
      return 'Renju (free opening)';
    case GameRule.FreestyleSwap1:
      return 'Freestyle (swap 1)';
  }
}

export enum SwapState {
  NotSwaped,
  Swap1Done,
}
