<template>
  <div class="settings">
    <group>
      <popup-radio :title="$t('setting.language')" v-model="languageValue" :options="languageOptions" />
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.thinking.timeTitle') }}</group-title>
      <radio :options="thinkTimeOptions" v-model="thinkTimeSelected" />
      <div class="time-settings" v-if="thinkTimeSelected == 0">
        <x-number :title="$t('setting.thinking.turnTime')" v-model="turnTimeInSecond" button-style="round" width="75px"
          :min="0.5" :max="99999" :step="turnTimeInSecond < 5 ? 0.5 : 1" fillable />
        <x-number :title="$t('setting.thinking.matchTime')" v-model="matchTimeInSecond" button-style="round"
          width="75px" :min="1" :max="99999" fillable />
        <x-number :title="$t('setting.thinking.maxDepth')" v-model="maxDepthValue" button-style="round" width="75px"
          :min="4" :max="64" fillable />
        <x-number :title="$t('setting.thinking.maxNode')" v-model="maxNodeValue" button-style="round" width="75px"
          :min="0" :max="99999" :step="0.1" fillable />
      </div>
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.board.title') }}</group-title>
      <x-number :title="$t('setting.board.size')" v-model="boardSizeValue" button-style="round" width="75px" :min="5"
        :max="22" fillable />
      <popup-radio :title="$t('setting.board.rule.title')" v-model="ruleValue" :options="ruleOptions" />
      <x-switch :title="$t('setting.board.aiThinkBlack')" v-model="aiThinkBlackValue" />
      <x-switch :title="$t('setting.board.aiThinkWhite')" v-model="aiThinkWhiteValue" />
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.thinking.thinkTitle') }}</group-title>
      <x-number :title="$t('setting.thinking.nbest')" v-model="nbestValue" button-style="round" width="75px" :min="1"
        :max="boardSizeValue * boardSizeValue" fillable />
      <x-number :title="$t('setting.thinking.handicap')" v-model="handicapValue" button-style="round" width="75px"
        :min="0" :max="100" :step="5" fillable />
      <x-number v-if="supportThreads" :title="$t('setting.thinking.threads')" v-model="threadsValue"
        button-style="round" width="75px" :min="1" :max="maxThreads" fillable />
      <x-switch v-if="supportThreads" :title="$t('setting.thinking.pondering')" v-model="ponderingValue" />
      <popup-radio :title="$t('setting.thinking.config.title')" v-model="configIndexValue"
        :options="configIndexOptions" />
      <popup-radio :title="$t('setting.thinking.candrange.title')" v-model="candRangeValue"
        :options="candRangeOptions" />
      <popup-radio :title="$t('setting.thinking.hashSize')" v-model="hashSizeValue" :options="hashSizeOptions" />
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.board.showTitle') }}</group-title>
      <popup-radio :title="$t('setting.board.clickCheck.title')" v-model="clickCheckValue"
        :options="clickCheckOptions" />
      <x-switch :title="$t('setting.board.showCoord')" v-model="showCoordValue" />
      <x-switch :title="$t('setting.board.showAnalysis')" v-model="showAnalysisValue" />
      <x-switch :title="$t('setting.board.showDetail')" v-model="showDetailValue" />
      <x-switch :title="$t('setting.board.showIndex')" v-model="showIndexValue" />
      <x-switch :title="$t('setting.board.showLastStep')" v-model="showLastStepValue" />
      <x-switch :title="$t('setting.board.showWinline')" v-model="showWinlineValue" />
      <x-switch :title="$t('setting.board.showForbid')" v-model="showForbidValue" />
      <popup-radio :title="$t('setting.board.showPvEval.title')" v-model="showPvEvalValue"
        :options="showPvEvalOptions" />
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.board.colorTitle') }}</group-title>
      <cell :title="$t('setting.board.boardColor')">
        <input type="color" v-model="boardColor" />
      </cell>
      <cell :title="$t('setting.board.lastStepColor')">
        <input type="color" v-model="lastStepColor" />
      </cell>
      <cell :title="$t('setting.board.winlineColor')">
        <input type="color" v-model="winlineColor" />
      </cell>
      <cell :title="$t('setting.board.bestMoveColor')">
        <input type="color" v-model="bestMoveColor" />
      </cell>
      <cell :title="$t('setting.board.thoughtMoveColor')">
        <input type="color" v-model="thoughtMoveColor" />
      </cell>
      <cell :title="$t('setting.board.lostMoveColor')">
        <input type="color" v-model="lostMoveColor" />
      </cell>
    </group>

    <group>
      <group-title slot="title">{{ $t('setting.browser.capability') }}</group-title>
      <cell :title="$t('setting.browser.simd')">
        <i v-if="supportSimd" class="fa fa-check" aria-hidden="true"></i>
        <i v-else class="fa fa-times" aria-hidden="true"></i>
        <span v-if="supportRelaxedSimd">{{ $t('setting.browser.relaxedSimd') }}</span>
      </cell>
      <cell :title="$t('setting.browser.threads')">
        <i v-if="supportThreads" class="fa fa-check" aria-hidden="true"></i>
        <i v-else class="fa fa-times" aria-hidden="true"></i>
      </cell>
      <cell v-if="supportThreads" :title="$t('setting.browser.maxthreads')">
        {{ maxThreads }}
      </cell>
    </group>

    <box gap="40px 20px 20px 20px">
      <x-button type="warn" @click.native="reset">{{ $t('setting.reset') }}</x-button>
    </box>
  </div>
</template>

<script>
import { Group, GroupTitle, XSwitch, XNumber, XButton, Radio, PopupRadio, Cell, Box } from 'vux'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'settings',
  components: {
    Group,
    GroupTitle,
    XSwitch,
    XNumber,
    XButton,
    Radio,
    PopupRadio,
    Cell,
    Box,
  },
  data: function () {
    return {
      showLanguageOption: false,
    }
  },
  computed: {
    ...mapState(['maxThreads', 'supportThreads', 'supportSimd', 'supportRelaxedSimd']),
    ...mapState('settings', [
      'language',
      'thinkTimeOption',
      'turnTime',
      'matchTime',
      'maxDepth',
      'maxNodes',
      'strength',
      'nbest',
      'threads',
      'pondering',
      'configIndex',
      'candRange',
      'boardSize',
      'rule',
      'aiThinkBlack',
      'aiThinkWhite',
      'clickCheck',
      'showCoord',
      'showAnalysis',
      'showDetail',
      'showPvEval',
      'showIndex',
      'showLastStep',
      'showWinline',
      'showForbid',
      'boardStyle',
      'hashSize',
    ]),
    languageOptions() {
      return [
        { "key": "zh-CN", "value": "简体中文" },
        { "key": "zh-TW", "value": "繁體中文" },
        { "key": "en", "value": "English" },
        { "key": "ko", "value": "한국어" },
        { "key": "ja", "value": "日本語" },
        { "key": "vi", "value": "Tiếng Việt" },
        { "key": "ru", "value": "Русский" }
      ]
    },
    thinkTimeOptions() {
      return [
        { key: 1, value: this.$t('setting.thinking.fast') },
        { key: 2, value: this.$t('setting.thinking.slow') },
        { key: 3, value: this.$t('setting.thinking.analysis') },
        { key: 0, value: this.$t('setting.thinking.custom') },
      ]
    },
    configIndexOptions() {
      return [
        { key: 0, value: this.$t('setting.thinking.config.mix9lite') },
        { key: 1, value: this.$t('setting.thinking.config.220723') },
        { key: 2, value: this.$t('setting.thinking.config.210901') },
      ]
    },
    candRangeOptions() {
      return [
        { key: 0, value: this.$t('setting.thinking.candrange.square2') },
        { key: 1, value: this.$t('setting.thinking.candrange.square2line3') },
        { key: 2, value: this.$t('setting.thinking.candrange.square3') },
        { key: 3, value: this.$t('setting.thinking.candrange.square3line4') },
        { key: 4, value: this.$t('setting.thinking.candrange.square4') },
        { key: 5, value: this.$t('setting.thinking.candrange.fullboard') },
      ]
    },
    hashSizeOptions() {
      return [
        { key: 128, value: '128MB' },
        { key: 256, value: '256MB' },
        { key: 512, value: '512MB' },
        { key: 1024, value: '1GB' },
        { key: 1536, value: '1.5GB' },
      ]
    },
    ruleOptions() {
      return [
        { key: 0, value: this.$t('setting.board.rule.gomoku') },
        { key: 1, value: this.$t('setting.board.rule.standard') },
        { key: 2, value: this.$t('setting.board.rule.renju') },
        { key: 5, value: this.$t('setting.board.rule.swap1') },
      ]
    },
    clickCheckOptions() {
      return [
        { key: 0, value: this.$t('setting.board.clickCheck.direct') },
        { key: 1, value: this.$t('setting.board.clickCheck.confirm') },
        { key: 2, value: this.$t('setting.board.clickCheck.slide') },
      ]
    },
    showPvEvalOptions() {
      return [
        { key: 0, value: this.$t('setting.board.showPvEval.none') },
        { key: 1, value: this.$t('setting.board.showPvEval.eval') },
        { key: 2, value: this.$t('setting.board.showPvEval.winrate') },
        // { key: 3, value: this.$t('setting.board.showPvEval.evalAndDepth') },
      ]
    },
    languageValue: {
      get() {
        return this.language
      },
      set(v) {
        this.setValue({ key: 'language', value: v })
      },
    },
    thinkTimeSelected: {
      get() {
        return this.thinkTimeOption
      },
      set(v) {
        this.setValue({ key: 'thinkTimeOption', value: v })
      },
    },
    turnTimeInSecond: {
      get() {
        return Math.floor(this.turnTime / 500) / 2
      },
      set(v) {
        this.setValue({ key: 'turnTime', value: v * 1000 })
      },
    },
    matchTimeInSecond: {
      get() {
        return Math.floor(this.matchTime / 1000)
      },
      set(v) {
        this.setValue({ key: 'matchTime', value: v * 1000 })
      },
    },
    maxDepthValue: {
      get() {
        return this.maxDepth
      },
      set(v) {
        this.setValue({ key: 'maxDepth', value: v })
      },
    },
    maxNodeValue: {
      get() {
        return this.maxNodes / 1000000
      },
      set(v) {
        this.setValue({ key: 'maxNodes', value: Math.ceil(v * 1000000) })
      },
    },
    handicapValue: {
      get() {
        return 100 - this.strength
      },
      set(v) {
        this.setValue({ key: 'strength', value: 100 - v })
      },
    },
    nbestValue: {
      get() {
        return this.nbest
      },
      set(v) {
        this.setValue({ key: 'nbest', value: v })
      },
    },
    threadsValue: {
      get() {
        return this.threads
      },
      set(v) {
        this.setValue({ key: 'threads', value: v })
      },
    },
    ponderingValue: {
      get() {
        return this.supportThreads ? this.pondering : false
      },
      set(v) {
        this.setValue({ key: 'pondering', value: v })
      },
    },
    configIndexValue: {
      get() {
        return this.configIndex
      },
      set(v) {
        this.setValue({ key: 'configIndex', value: v })
      },
    },
    candRangeValue: {
      get() {
        return this.candRange
      },
      set(v) {
        this.setValue({ key: 'candRange', value: v })
      },
    },
    hashSizeValue: {
      get() {
        return this.hashSize
      },
      set(v) {
        this.setValue({ key: 'hashSize', value: v })
      },
    },
    boardSizeValue: {
      get() {
        return this.boardSize
      },
      set(v) {
        this.setValue({ key: 'boardSize', value: v })
      },
    },
    ruleValue: {
      get() {
        return this.rule
      },
      set(v) {
        this.setValue({ key: 'rule', value: v })
        this.checkForbid()
      },
    },
    aiThinkBlackValue: {
      get() {
        return this.aiThinkBlack
      },
      set(v) {
        this.setValue({ key: 'aiThinkBlack', value: v })
      },
    },
    aiThinkWhiteValue: {
      get() {
        return this.aiThinkWhite
      },
      set(v) {
        this.setValue({ key: 'aiThinkWhite', value: v })
      },
    },
    clickCheckValue: {
      get() {
        return this.clickCheck
      },
      set(v) {
        this.setValue({ key: 'clickCheck', value: v })
      },
    },
    showCoordValue: {
      get() {
        return this.showCoord
      },
      set(v) {
        this.setValue({ key: 'showCoord', value: v })
      },
    },
    showAnalysisValue: {
      get() {
        return this.showAnalysis
      },
      set(v) {
        this.setValue({ key: 'showAnalysis', value: v })
      },
    },
    showDetailValue: {
      get() {
        return this.showDetail
      },
      set(v) {
        this.setValue({ key: 'showDetail', value: v })
      },
    },
    showPvEvalValue: {
      get() {
        return this.showPvEval
      },
      set(v) {
        this.setValue({ key: 'showPvEval', value: v })
      },
    },
    showIndexValue: {
      get() {
        return this.showIndex
      },
      set(v) {
        this.setValue({ key: 'showIndex', value: v })
      },
    },
    showLastStepValue: {
      get() {
        return this.showLastStep
      },
      set(v) {
        this.setValue({ key: 'showLastStep', value: v })
      },
    },
    showWinlineValue: {
      get() {
        return this.showWinline
      },
      set(v) {
        this.setValue({ key: 'showWinline', value: v })
      },
    },
    showForbidValue: {
      get() {
        return this.showForbid
      },
      set(v) {
        this.setValue({ key: 'showForbid', value: v })
      },
    },
    boardColor: {
      get() {
        return this.boardStyle.boardColor
      },
      set(v) {
        this.setBoardStyle({ key: 'boardColor', value: v })
      },
    },
    lastStepColor: {
      get() {
        return this.boardStyle.lastStepColor
      },
      set(v) {
        this.setBoardStyle({ key: 'lastStepColor', value: v })
      },
    },
    winlineColor: {
      get() {
        return this.boardStyle.winlineColor
      },
      set(v) {
        this.setBoardStyle({ key: 'winlineColor', value: v })
      },
    },
    bestMoveColor: {
      get() {
        return this.boardStyle.bestMoveColor
      },
      set(v) {
        this.setBoardStyle({ key: 'bestMoveColor', value: v })
      },
    },
    thoughtMoveColor: {
      get() {
        return this.boardStyle.thoughtMoveColor
      },
      set(v) {
        this.setBoardStyle({ key: 'thoughtMoveColor', value: v })
      },
    },
    lostMoveColor: {
      get() {
        return this.boardStyle.lostMoveColor
      },
      set(v) {
        this.setBoardStyle({ key: 'lostMoveColor', value: v })
      },
    },
  },
  methods: {
    ...mapMutations('settings', ['setValue', 'setBoardStyle']),
    ...mapActions('settings', ['clearCookies']),
    ...mapActions('ai', ['checkForbid']),
    reset() {
      this.clearCookies()
      location.reload()
    },
  },
  watch: {},
}
</script>

<style lang="less" scoped>
.settings {
  max-width: 100%;

  @media (min-width: 800px) {
    max-width: 800px;
    margin: 0 auto; // Center align if necessary
  }
}
</style>
