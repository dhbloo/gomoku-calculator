<template>
  <div class="game">
    <div class="board-box">
      <Board ref="board" :is-ai-turn="isAITurn" :preview-pv="previewPv" @clicked="clicked"></Board>

      <div class="button-box">
        <scroller lock-y :scrollbar-x="$store.state.screenWidth < buttonBarWidth" :bounce="false">
          <div class="button-box" :style="{ width: `${buttonBarWidth}px` }">
            <flexbox :gutter="0">
              <flexbox-item>
                <x-button @click.native="newGame" style="padding: 0">
                  <i class="fa fa-file-o" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="position.length == 0" style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    backToBegin()
                  })
                }
                  ">
                  <i class="fa fa-angle-double-left fa-lg" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="position.length == 0" style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    backward()
                    clearUsedTime()
                  })
                }
                  ">
                  <i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="position.length == lastPosition.length" style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    forward()
                  })
                }
                  ">
                  <i class="fa fa-angle-right fa-lg" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="position.length == lastPosition.length" style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    forwardToEnd()
                  })
                }
                  ">
                  <i class="fa fa-angle-double-right fa-lg" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button v-if="!ready" style="padding: 0" @click.native="showLoading = true">
                  <i class="fa fa-spinner fa-spin"></i>
                </x-button>
                <x-button v-else :disabled="thinking || gameEnded" style="padding: 0" @click.native="startThink">
                  <i v-if="thinking" class="fa fa-cog fa-spin"></i>
                  <i v-else class="fa fa-play" :style="{
                    color: gameEnded ? '#145A32' : '#229954',
                  }"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="!thinking" style="padding: 0" @click.native="stop">
                  <i class="fa fa-stop" :style="{ color: thinking ? '#E74C3C' : '#78281F' }"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button :disabled="thinking || !ready || gameEnded" style="padding: 0" @click.native="() => {
                  showBalanceOptions = true
                }
                  ">
                  <i class="fa fa-adjust" :style="{
                    color: thinking || !ready || gameEnded ? '#1A5276' : '#3498DB',
                  }"></i>
                </x-button>
              </flexbox-item>

              <flexbox-item :span="1 / 40" style="min-width: 0px"></flexbox-item>

              <flexbox-item>
                <x-button style="padding: 0" @click.native="() => {
                  showScreenshotOptions = true
                }
                  ">
                  <i class="fa fa-picture-o" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button style="padding: 0" @click.native="() => {
                  setValue({
                    key: 'indexOrigin',
                    value: indexOrigin == 0 ? position.length : 0,
                  })
                }
                  ">
                  <i v-if="indexOrigin == 0" class="fa fa-info-circle" aria-hidden="true"></i>
                  <i v-else class="fa fa-info" aria-hidden="true"></i>
                </x-button>
              </flexbox-item>

              <flexbox-item :span="1 / 40" style="min-width: 0px"></flexbox-item>

              <flexbox-item>
                <x-button style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    rotate()
                  })
                }
                  ">
                  <i class="fa fa-repeat"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    showFlipOptions = true
                  })
                }
                  ">
                  <i class="fa fa-exchange"></i>
                </x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button style="padding: 0" @click.native="() => {
                  checkThinking().then(() => {
                    showMoveOptions = true
                  })
                }
                  ">
                  <i class="fa fa-arrows"></i>
                </x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </scroller>
      </div>
    </div>

    <load-more :show-loading="false" background-color="#fbf9fe" class="seperator"></load-more>

    <div class="info-box" :style="showAnalysis ? {} : { display: 'none' }">
      <div>
        <x-progress v-if="thinking && aiTimeUsed > 0 && turnTime != 0"
          :percent="Math.min((100 * aiTimeUsed) / Math.min(turnTime, matchTime), 100)"
          :show-cancel="false"></x-progress>

        <!-- 单点分析的信息输出 -->
        <x-table v-if="nbest == 1" :cell-bordered="true" style="background-color: #fff; line-height: 210%">
          <thead>
            <tr style="background-color: #f7f7f7">
              <th>{{ $t('game.info.depth') }}</th>
              <th>{{ $t('game.info.eval') }}</th>
              <th>{{ $t('game.info.speed') }}</th>
              <th>{{ $t('game.info.nodes') }}</th>
              <th>{{ $t('game.info.time') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ outputs.pv[0].depth + '-' + outputs.pv[0].seldepth }}</td>
              <td style="font-weight: bold">{{ outputs.pv[0].eval }}</td>
              <td>{{ getSpeedText(outputs.speed) }}</td>
              <td>{{ getNodesText(outputs.nodes) }}</td>
              <td>{{ getTimeText(outputs.time) }}</td>
            </tr>
            <tr>
              <td colspan="5">
                <flexbox align="stretch" :gutter="0" style="padding: 5px">
                  <flexbox-item style="
                      padding: 2px 10px 2px 0;
                      width: initial;
                      line-height: initial;
                      flex: none;
                    ">
                    {{ $t('game.info.bestline') }}
                  </flexbox-item>
                  <flexbox-item>
                    <Bestline :bestline="outputs.pv[0].bestline" :boardSize="boardSize"
                      v-on:pvPreview="(pv) => (previewPv = pv)" v-on:pvSet="setPvAsPosition"></Bestline>
                  </flexbox-item>
                </flexbox>
              </td>
            </tr>
          </tbody>
        </x-table>

        <!-- 多点分析的信息输出 -->
        <div v-else>
          <x-table :cell-bordered="true" style="background-color: #fff; line-height: 210%">
            <thead>
              <tr style="background-color: #f7f7f7">
                <th>{{ $t('game.info.speed') }}</th>
                <th>{{ $t('game.info.nodes') }}</th>
                <th>{{ $t('game.info.time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ getSpeedText(outputs.speed) }}</td>
                <td>{{ getNodesText(outputs.nodes) }}</td>
                <td>{{ getTimeText(outputs.time) }}</td>
              </tr>
            </tbody>
          </x-table>
          <x-table :cell-bordered="true" style="background-color: #fff; line-height: 210%">
            <thead>
              <tr style="background-color: #f7f7f7">
                <th>{{ $t('game.info.nbestIndex') }}</th>
                <th>{{ $t('game.info.depth') }}</th>
                <th>{{ $t('game.info.eval') }}</th>
                <th>{{ $t('game.info.bestline') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in Math.min(nbest, outputs.pv.length)" :key="i">
                <td style="min-width: 40px">{{ i }}</td>
                <td style="min-width: 55px">
                  {{ outputs.pv[i - 1].depth + '-' + outputs.pv[i - 1].seldepth }}
                </td>
                <td style="font-weight: bold; min-width: 55px">{{ outputs.pv[i - 1].eval }}</td>
                <td>
                  <Bestline :bestline="outputs.pv[i - 1].bestline" :boardSize="boardSize"
                    v-on:pvPreview="(pv) => (previewPv = pv)" v-on:pvSet="setPvAsPosition"></Bestline>
                </td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </div>

      <group>
        <group-title slot="title">
          {{ $t('game.currentPos') }}
          <span v-if="clipboardAvailable" style="float:right;">
            <button class="icon-button" @click="copyPosStrToClipboard">
              <i class="fa fa-files-o" aria-hidden="true"></i>
            </button>
            <button class="icon-button" @click="pastePosStrFromClipboard">
              <i class="fa fa-clipboard" aria-hidden="true"></i>
            </button>
          </span>
        </group-title>
        <x-textarea ref="curposArea" :value="posStr" @on-change="(v) => { setPosStr(v) }" style="padding: 5px 12px"
          :show-counter="false" :rows="1" autosize></x-textarea>
      </group>

      <group :title="$t('game.evalChart')">
        <div :style="{ width: chartWidth + 'px', height: chartWidth * 0.6 + 'px' }">
          <v-chart ref="chart" :data="evalData" :width="chartWidth" :height="chartWidth * 0.6">
            <v-scale ref="chartx" x :tick-interval="2" />
            <v-scale y alias="eval" :tick-count="5" />
            <v-point :style="{ stroke: '#fff', lineWidth: 1 }" :size="5" shape="smooth" series-field="piece" />
            <v-line shape="smooth" series-field="piece" />
            <v-area shape="smooth" series-field="piece" />
          </v-chart>
        </div>
      </group>
    </div>

    <div v-transfer-dom>
      <actionsheet v-model="showBalanceOptions" :menus="balanceOptions" @on-click-menu="(key) => {
        if (key == 0 || key == 1) this.startThinkBalance(key + 1)
      }
        " show-cancel :cancel-text="$t('common.cancel')"></actionsheet>
    </div>

    <div v-transfer-dom>
      <actionsheet v-model="showFlipOptions" :menus="flipOptions" @on-click-menu="onFlipOption" show-cancel
        :cancel-text="$t('common.cancel')"></actionsheet>
    </div>

    <div v-transfer-dom>
      <actionsheet v-model="showMoveOptions" :menus="moveOptions" @on-click-menu="onMoveOption" show-cancel
        :cancel-text="$t('common.cancel')"></actionsheet>
    </div>

    <div v-transfer-dom>
      <actionsheet v-model="showScreenshotOptions" :menus="shotOptions" @on-click-menu="onScreenshotOption" show-cancel
        :cancel-text="$t('common.cancel')"></actionsheet>
    </div>

    <div v-transfer-dom>
      <popup v-model="showScreenshot" style="height: 50%" is-transparent>
        <div class="screenshot-box">
          <span v-if="gifLoading">
            {{ $t('game.gifLoading') }}
            <i class="fa fa-spinner fa-pulse fa-lg" aria-hidden="true" />
          </span>
          <img ref="screenshot" class="screenshot-img" />
          <x-button v-if="!gifLoading" type="primary" :disabled="isOnIOSBrowser" :plain="isOnIOSBrowser"
            :text="isOnIOSBrowser ? $t('game.saveScreenshotIOS') : $t('game.saveScreenshot')"
            @click.native="saveScreenshot"></x-button>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showLoading" hide-on-blur>
        <div style="margin:20px auto;">{{ $t('game.engineLoading') }}</div>
        <x-circle style="width: 100px;height: 100px;margin: 20px auto;" :percent="loadingProgress * 100"
          :stroke-width="6" :trail-width="6">
          <span style="color:#36D1DC">{{ Math.floor(loadingProgress * 10000) / 100 }}%</span>
        </x-circle>
        <div style="margin:10px auto;" @click="showLoading = false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {
  TransferDom,
  Flexbox,
  FlexboxItem,
  XButton,
  Scroller,
  LoadMore,
  XTable,
  XTextarea,
  Actionsheet,
  XProgress,
  Group,
  GroupTitle,
  Popup,
  VChart,
  VPoint,
  VLine,
  VScale,
  VArea,
  XDialog,
  XCircle,
  dateFormat,
} from 'vux'
import Board from '@/components/Board.vue'
import Bestline from '@/components/Bestline.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { Promise } from 'q'
import { RENJU } from '@/store/modules/settings'

export default {
  name: 'game',
  directives: {
    TransferDom,
  },
  components: {
    Board,
    Bestline,
    Flexbox,
    FlexboxItem,
    XButton,
    Scroller,
    LoadMore,
    XTable,
    XTextarea,
    Actionsheet,
    XProgress,
    Group,
    GroupTitle,
    Popup,
    VChart,
    VPoint,
    VLine,
    VScale,
    VArea,
    XDialog,
    XCircle,
  },
  data: function () {
    return {
      aiTimeUsed: 0,
      showLoading: false,
      showBalanceOptions: false,
      showFlipOptions: false,
      showMoveOptions: false,
      showScreenshotOptions: false,
      showScreenshot: false,
      console: console,
      evalData: [
        { index: 0, eval: 0, piece: this.$t('game.black') },
        { index: 0, eval: 0, piece: this.$t('game.white') },
      ],
      thinkingCanceled: false,
      gifLoading: false,
      screenshotData: null,
      previewPv: null,
      clipboardAvailable: navigator.clipboard && window.isSecureContext
    }
  },
  computed: {
    ...mapState(['screenWidth', 'screenHeight', 'isOnIOSBrowser']),
    ...mapState('settings', [
      'boardSize',
      'indexOrigin',
      'rule',
      'nbest',
      'aiThinkBlack',
      'aiThinkWhite',
      'showAnalysis',
    ]),
    ...mapState('ai', ['outputs', 'thinking', 'lastThinkTime', 'ready', 'loadingProgress']),
    ...mapState('position', ['position', 'lastPosition', 'winline', 'swaped']),
    ...mapGetters('settings', ['turnTime', 'matchTime', 'gameRule']),
    ...mapGetters('ai', ['bestlineStr', 'bestline']),
    ...mapGetters('position', ['isEmpty', 'playerToMove', 'moveLeftCount', 'posStr']),
    buttonBarWidth() {
      const Width = 620
      if (this.screenWidth >= 1024)
        return Math.min(Width, Width + Math.max(0, this.screenWidth - 1024))
      else
        return Width
    },
    chartWidth() {
      if (this.screenWidth >= 1024 && this.screenWidth / this.screenHeight >= 4 / 3) {
        const MarginSum = 30 + 2 * Math.min(20, Math.max(0, 0.3 * this.screenWidth - 350))
        const MaxWidth = 600

        return Math.min(
          this.screenWidth -
          Math.max(this.$store.getters.boardCanvasWidth, this.buttonBarWidth) -
          MarginSum,
          MaxWidth
        )
      } else {
        return this.screenWidth
      }
    },
    bestline() {
      return this.bestlineStr(0)
    },
    balanceOptions() {
      return [this.$t('game.balance1'), this.$t('game.balance2')]
    },
    flipOptions() {
      return [
        this.$t('game.flip') + ' |',
        this.$t('game.flip') + ' -',
        this.$t('game.flip') + ' ╲',
        this.$t('game.flip') + ' ╱',
      ]
    },
    moveOptions() {
      return [
        this.$t('game.move') + ' ↑',
        this.$t('game.move') + ' ↓',
        this.$t('game.move') + ' ←',
        this.$t('game.move') + ' →',
      ]
    },
    shotOptions() {
      return [this.$t('game.shotJpg'), this.$t('game.shotGif')]
    },
    isAITurn() {
      return (
        (this.playerToMove == 'BLACK' && this.aiThinkBlack) ||
        (this.playerToMove == 'WHITE' && this.aiThinkWhite)
      )
    },
    gameEnded() {
      return this.winline.length > 0 || this.moveLeftCount == 0
    },
  },
  methods: {
    ...mapMutations('position', {
      newBoard: 'new',
      setSwaped: 'setSwaped',
    }),
    ...mapMutations('settings', ['setValue']),
    ...mapMutations('ai', ['clearUsedTime']),
    ...mapActions('position', [
      'setPosStr',
      'makeMove',
      'backToBegin',
      'backward',
      'forward',
      'forwardToEnd',
      'rotate',
      'flip',
      'moveTowards',
    ]),
    ...mapActions('ai', ['think', 'stop', 'restart', 'initEngine']),

    checkThinking() {
      return new Promise((resolve) => {
        if (this.thinking) {
          this.$vux.confirm.show_i18n({
            title: this.$t('game.interruptThinking.title'),
            content: this.$t('game.interruptThinking.msg'),
            onCancel: () => { },
            onConfirm: () => {
              this.thinkingCanceled = true
              this.stop()
              resolve()
            },
          })
        } else resolve()
      })
    },

    onFlipOption(key) {
      switch (key) {
        case 0:
          this.flip([1, 0])
          break
        case 1:
          this.flip([0, 1])
          break
        case 2:
          this.flip([0, 0])
          break
        case 3:
          this.flip([1, 1])
          break
      }
    },

    onMoveOption(key) {
      switch (key) {
        case 0:
          this.moveTowards([0, -1])
          break
        case 1:
          this.moveTowards([0, 1])
          break
        case 2:
          this.moveTowards([-1, 0])
          break
        case 3:
          this.moveTowards([1, 0])
          break
      }
    },

    onScreenshotOption(key) {
      let _this = this
      let delayPrompt = this.$t('game.gifDelay')
      let startIndex, delay
      switch (key) {
        case 0:
          this.screenshotData = { url: this.$refs.board.screenshot(), ext: 'jpg' }
          this.$refs.screenshot.setAttribute('src', this.screenshotData.url)
          this.showScreenshot = true
          break
        case 1:
          _this.$vux.confirm.prompt_i18n('', {
            title: this.$t('game.gifStart'),
            inputAttrs: { type: 'number', min: 1, max: this.position.length },
            onShow() {
              _this.$vux.confirm.setInputValue('1')
            },
            onConfirm(v) {
              startIndex = +v
              if (isNaN(startIndex)) startIndex = 1
              startIndex = Math.max(0, Math.min(startIndex - 1, _this.position.length))
              _this.$vux.confirm.prompt_i18n('', {
                title: delayPrompt,
                inputAttrs: { type: 'number', min: 100 },
                onShow() {
                  _this.$vux.confirm.setInputValue('1000')
                },
                onConfirm(v) {
                  delay = +v
                  if (isNaN(delay)) delay = 1000
                  delay = Math.max(100, delay)
                  _this.gifLoading = true
                  _this.$refs.screenshot.setAttribute('src', '')
                  _this.showScreenshot = true
                  _this.$refs.board.exportGIF(startIndex, delay, (blob) => {
                    _this.gifLoading = false
                    _this.screenshotData = { url: URL.createObjectURL(blob), ext: 'gif' }
                    _this.$refs.screenshot.setAttribute('src', _this.screenshotData.url)
                  })
                },
              })
            },
          })
          break
      }
    },
    saveScreenshot() {
      function downloadBlobURL(blobUrl, name) {
        // Create a link element
        const link = document.createElement('a')

        // Set link's href to point to the Blob URL
        link.href = blobUrl
        link.download = name

        // Append link to the body
        document.body.appendChild(link)

        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        )

        // Remove link from body
        document.body.removeChild(link)
      }

      downloadBlobURL(
        this.screenshotData.url,
        `screenshot-${dateFormat(new Date(), 'YYYYMMDDHHmmss')}.${this.screenshotData.ext}`
      )
    },

    newGame() {
      this.checkThinking().then(() => {
        this.newBoard(this.boardSize)
        this.restart()
      })
    },

    clicked(e) {
      let pos = [e.x, e.y]
      if (this.thinking) return

      if (e.button == 0) {
        if ((this.isEmpty(pos) && this.winline.length == 0) || this.isAITurn) {
          if (!this.isAITurn) {
            if (this.rule == 5 && !this.swaped && this.position.length == 1) {
              // SWAP1规则
              return this.$vux.confirm.show_i18n({
                title: this.$t('game.swap.questionTitle'),
                content: this.$t('game.swap.questionMsg'),
                onCancel: () => {
                  this.setSwaped()
                },
                onConfirm: () => {
                  this.swapBlackAndWhite()
                  if (this.isAITurn) this.startThink()
                },
              })
            } else if (this.gameRule == RENJU) {
              let isForbidPos = false
              for (let forbidPos of this.outputs.forbid) {
                if (pos[0] == forbidPos[0] && pos[1] == forbidPos[1]) {
                  isForbidPos = true
                  break
                }
              }
              if (isForbidPos) {
                return this.$vux.alert.show_i18n({
                  title: this.$t('game.forbid.title'),
                  content: this.$t('game.forbid.msg'),
                })
              }
            }

            this.makeMove(pos)
          }
          if (this.isAITurn) this.startThink()
        }
      } else if (e.button == 2) {
        this.backward()
        this.clearUsedTime()
      }
    },

    startThink() {
      if (this.gameEnded) return

      this.think().then((pos) => {
        if (this.thinkingCanceled) {
          this.thinkingCanceled = false
          return
        }

        if (this.outputs.swap) {
          this.swapBlackAndWhite()
          this.$vux.alert.show_i18n({
            title: this.$t('game.swap.title'),
            content: this.$t('game.swap.msg'),
            onHide() {
              if (this.isAITurn) this.startThink()
            },
          })
        } else {
          this.makeMove(pos)

          let e = +this.outputs.pv[0].eval
          if (!isNaN(e)) {
            this.evalData.push({
              index: this.position.length,
              eval: e,
              piece: this.playerToMove == 'BLACK' ? this.$t('game.white') : this.$t('game.black'),
            })
          }

          if (this.isAITurn) this.startThink()
        }
      })
    },

    startThinkBalance(mode) {
      if (this.gameEnded) return

      this.think({ balanceMode: mode }).then((pos) => {
        if (this.thinkingCanceled) {
          this.thinkingCanceled = false
          return
        }

        this.makeMove(pos)
        if (mode == 2) {
          const pos2 = this.outputs.pv[0].bestline[1]
          this.makeMove(pos2)
        }
      })
    },

    swapBlackAndWhite() {
      this.setSwaped()
      let thinkBlack = this.aiThinkWhite
      let thinkWhite = this.aiThinkBlack
      this.setValue({ key: 'aiThinkBlack', value: thinkBlack })
      this.setValue({ key: 'aiThinkWhite', value: thinkWhite })
    },

    setPvAsPosition(pv) {
      this.checkThinking().then(() => {
        let fullPosition = pv.position.concat(pv.pv)
        this.newBoard(this.boardSize)
        for (let pos of fullPosition) {
          if (!this.makeMove(pos)) break
        }
      })
    },

    getSpeedText(speed) {
      if (speed < 10000) {
        return speed.toString();
      } else if (speed < 100000000) {
        return Math.floor(speed / 1000) + "K";
      } else {
        return Math.floor(speed / 1000000) + "M";
      }
    },

    getNodesText(nodes) {
      if (nodes < 10000) {
        return nodes.toString();
      } else if (nodes < 10000000) {
        return Math.floor(nodes / 1000) + "K";
      } else if (nodes < 100000000000) {
        return Math.floor(nodes / 1000000) + "M";
      } else if (nodes < 100000000000000) {
        return Math.floor(nodes / 1000000000) + "G";
      } else {
        return Math.floor(nodes / 1000000000000) + "T";
      }
    },

    getTimeText(time) {
      if (time < 1000000) {
        return Math.floor(time / 1000) + "." + (Math.floor(time / 100) % 10) + "s";
      } else if (time < 360000000) {
        return Math.floor(time / 60000) + "min";
      } else {
        return Math.floor(time / 3600000) + "h";
      }
    },

    async copyPosStrToClipboard() {
      await navigator.clipboard.writeText(this.posStr);
      this.$vux.toast.text(this.$t('game.copiedToClipboard'))
    },

    async pastePosStrFromClipboard() {
      const posStr = await navigator.clipboard.readText();
      this.setPosStr(posStr)
    },
  },
  watch: {
    bestline: function () {
      if (this.$refs.bestlineArea) this.$refs.bestlineArea.updateAutosize()
    },
    posStr: function (newPos) {
      this.$refs.curposArea.updateAutosize()
      let oldIndex = this.evalData[this.evalData.length - 1].index
      let newIndex = Math.max(this.position.length, 1)
      if (newIndex < oldIndex) {
        for (let i = this.evalData.length - 1; i > 0; i--) {
          if (this.evalData[i].index > newIndex) this.evalData.pop()
        }
      }
      if (newPos.length > 0) this.$router.push({ name: 'game', params: { pos: newPos } })
      else this.$router.push({ name: 'game' })
    },
    boardSize: function (newSize) {
      if (this.thinking) this.stop()
      this.newBoard(newSize)
      this.restart()
    },
    loadingProgress: function (progress) {
      if (progress == 1) this.showLoading = false
    },
  },
  mounted() {
    this.newBoard(this.boardSize)
    if (this.$route.params.pos) this.setPosStr(this.$route.params.pos)

    window.addEventListener('keydown', (event) => {
      const target = event.target

      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return
      if (event.repeat)
        return

      switch (event.key) {
        case 'ArrowLeft':
          this.checkThinking().then(() => this.backward())
          break
        case 'ArrowRight':
          this.checkThinking().then(() => this.forward())
          break
        case 'Home':
          this.checkThinking().then(() => this.backToBegin())
          break
        case 'End':
          this.checkThinking().then(() => this.forwardToEnd())
          break
        case ' ':
          if (this.thinking) this.stop()
          else if (this.ready && !this.gameEnded) this.startThink()
          break
        case 'b':
          this.checkThinking().then(() => this.startThinkBalance(1))
          break
        case 'B':
          this.checkThinking().then(() => this.startThinkBalance(2))
          break
      }
    })
    setInterval(() => {
      this.aiTimeUsed = this.thinking ? Date.now() - this.lastThinkTime : 0
    }, 100)

    this.initEngine().catch((err) => {
      this.$vux.alert.show_i18n({
        title: this.$t('game.engineLoadingError'),
        content: err.toString(),
      })
    })
  },
}
</script>

<style lang="less" scoped>
.selectable {
  -webkit-user-select: text;
  -khtml-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.game {
  overflow-x: hidden;
}

.button-box {
  margin: auto;
  margin-top: ~'min(1vw, 10px)';
}

.seperator {
  margin-top: 20px;
  margin-bottom: 0px;
}

.screenshot-box {
  width: 95%;
  text-align: center;
  background-color: #fff;
  height: 95%;
  margin: 0 auto;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.screenshot-img {
  -webkit-touch-callout: default;
  flex: 1 1 auto;
  align-self: center;
  max-width: 100%;
  max-height: calc(100% - 42px);
}

@media (min-aspect-ratio: ~'4/3') and (min-width: 1024px) {
  .seperator {
    display: none !important;
  }

  .game {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
  }

  .board-box {
    margin: 20px 10px;
  }

  @infobox-padding: ~'min(20px, max(30vw - 350px, 0px))';

  .info-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-top: 20px;
    margin-left: @infobox-padding;
    margin-right: calc(10px + @infobox-padding);
    padding-top: 10px;
    max-width: 600px;
  }
}

.loading-circle {
  width: 100px;
  height: 100px;
  margin: 20px auto;
}

.icon-button {
  background: none;
  border: none;
  padding: 0.1rem 0.25rem;
  border-radius: 0.1rem;
  transition: background-color 0.2s ease;
}

.icon-button:active {
  background-color: rgba(0, 0, 0, 0.2);
}

.icon-button i {
  font-size: 0.8rem;
  color: darkgray;
}

.icon-button:hover i {
  color: black;
}

.icon-button:active i {
  color: black;
}
</style>
