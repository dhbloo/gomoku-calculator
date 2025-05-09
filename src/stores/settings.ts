import { defineStore } from 'pinia';
import { BoardSettings, DefaultBoardStyle } from 'src/components/GameBoard';
import { GameRule } from 'src/services/game-types';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    boardSize: 15,
    rule: GameRule.FreestyleFreeOpen,
    boardSettings: {
      boardStyle: DefaultBoardStyle,
      clickBehavior: 'direct',
      showCoord: true,
      showIndex: true,
      showForbid: true,
      showWinline: true,
      showNextMove: true,
      highlightLastStep: true,
      showRealtimeStatus: true,
      pvMainDisplayType: 'none',
      pvSubDisplayType: 'none',
      previewOpacity: 0.99,
      previewOpacityDecay: 0.95,
    } as BoardSettings,
  }),

  getters: {},

  actions: {},
});
