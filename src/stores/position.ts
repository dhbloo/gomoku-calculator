import { defineStore } from 'pinia';
import {
  BasicRule,
  Color,
  Coord,
  Direction,
  Move,
  SwapState,
  Symmetry,
  applySymmetry,
  coordToIndex,
  getBasicRule,
  moveToString,
  opposite,
  parseMove,
} from 'src/services/game-types';
import { useSettingsStore } from './settings';

export const usePositionStore = defineStore('position', {
  state: () => ({
    size: 15,
    board: Array<Color>(15 * 15).fill(Color.Empty),
    sideToMove: Color.Black,
    history: Array<Move>(),
    lastHistory: Array<Move>(),
    winline: null as [Coord, Coord] | null,
    swapState: SwapState.NotSwaped,
  }),

  getters: {
    posStr: (state) =>
      state.history.map((m) => moveToString(m, false)).join(''),
    get: (state) => (coord: Coord) => {
      const index = coordToIndex(coord, state.size);
      if (index == -1) return null;
      else return state.board[index];
    },
    isEmpty: (state) => (coord: Coord) => {
      const index = coordToIndex(coord, state.size);
      return index != -1 && state.board[index] == Color.Empty;
    },
    nonPassMoveCount: (state) => {
      return state.history.filter((move) => move != 'pass').length;
    },
    passMoveCount: (state) => {
      return state.history.filter((move) => move == 'pass').length;
    },
    moveLeftCount: (state) => {
      return (
        state.size * state.size -
        state.history.filter((move) => move != 'pass').length
      );
    },
    finished: (state) => {
      return (
        state.winline != null ||
        state.size * state.size ==
          state.history.filter((move) => move != 'pass').length
      );
    },
    nextMove: (state) => {
      return state.history.length < state.lastHistory.length
        ? state.lastHistory[state.history.length]
        : null;
    },
  },

  actions: {
    newGame(size: number) {
      this.size = size;
      this.board = Array<Color>(size * size).fill(Color.Empty);
      this.sideToMove = Color.Black;
      this.history = [];
      this.lastHistory = [];
      this.winline = null;
      this.swapState = SwapState.NotSwaped;
    },
    checkWin() {
      if (this.history.length < 9) return false;
      const lastMove = this.history[this.history.length - 1];
      if (lastMove == 'pass') return false;
      const color = this.board[coordToIndex(lastMove, this.size)];
      if (color === Color.Empty) return false;

      const settings = useSettingsStore();
      const basicRule = getBasicRule(settings.rule);
      const exactFive =
        basicRule == BasicRule.Standard || basicRule == BasicRule.Renju;
      const allDirections = [
        Direction.Up,
        Direction.Left,
        Direction.UpLeft,
        Direction.UpRight,
      ];
      for (const dir of allDirections) {
        let count = 1,
          i,
          j;
        for (i = 1; ; i++) {
          const index = coordToIndex(lastMove + i * dir, this.size);
          if (index == -1) break;
          if (this.board[index] == color) count++;
          else break;
        }
        for (j = 1; ; j++) {
          const index = coordToIndex(lastMove - j * dir, this.size);
          if (index == -1) break;
          if (this.board[index] == color) count++;
          else break;
        }
        if (exactFive ? count == 5 : count >= 5) {
          this.winline = [lastMove + (i - 1) * dir, lastMove - (j - 1) * dir];
          return true;
        }
      }
      return false;
    },
    setPosStr(posStr: string) {
      posStr = posStr.trim().toLowerCase();
      if (posStr == this.posStr) return;

      const moveStrArray = posStr.match(/--|[a-z]\d+/g);
      if (!moveStrArray) return;

      this.newGame(this.size);
      for (const moveStr of moveStrArray) {
        const move = parseMove(moveStr);
        this.makeMove(move);
        if (this.finished) break;
      }
    },
    makeMove(move: Move) {
      if (move == 'pass') {
        this.sideToMove = opposite(this.sideToMove);
        this.history.push('pass');
      } else if (!this.isEmpty(move)) {
        return;
      } else {
        const index = coordToIndex(move, this.size);
        this.board[index] = this.sideToMove;
        this.sideToMove = opposite(this.sideToMove);
        this.history.push(move);
      }

      const prevMove = this.lastHistory[this.history.length - 1];
      if (prevMove != move) this.lastHistory = [...this.history];
      this.checkWin();
      //checkForbid();
    },
    backward(backToBegin = false) {
      if (this.history.length == 0) return;
      do {
        const move = this.history.pop();
        if (move != 'pass') {
          const index = coordToIndex(move as Coord, this.size);
          this.board[index] = Color.Empty;
        }
        this.sideToMove = opposite(this.sideToMove);
      } while (backToBegin && this.history.length > 0);
      this.winline = null;
      //checkForbid();
    },
    forward(forwardToEnd = false) {
      if (this.lastHistory.length <= this.history.length) return;
      do {
        const move = this.lastHistory[this.history.length];
        this.makeMove(move);
      } while (forwardToEnd && this.lastHistory.length > this.history.length);
    },
    applySymmetry(sym: Symmetry) {
      const moves = this.history.map((m) => {
        return m == 'pass' ? 'pass' : applySymmetry(m as Coord, this.size, sym);
      });
      this.newGame(this.size);
      for (const move of moves) this.makeMove(move);
    },
    applyTranslation(dir: Direction) {
      const moves = this.history.map((m) => {
        return m == 'pass' ? 'pass' : m + dir;
      });
      this.newGame(this.size);
      for (const move of moves)
        this.makeMove(move == 'pass' || this.isEmpty(move) ? move : 'pass');
    },
  },
});
