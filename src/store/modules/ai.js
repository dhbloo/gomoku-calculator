import * as engine from '@/ai/engine'
import { RENJU, CONFIGS } from './settings'

const state = {
  loadingProgress: 0.0,
  ready: false,
  startSize: 0,
  restart: false,
  thinking: false,
  timeUsed: 0,
  lastThinkTime: 0,
  lastThinkPosition: [],
  currentConfig: null,
  hashSize: null,
  outputs: {
    pos: null,
    swap: null,
    currentPV: 0,
    pv: [
      {
        depth: 0,
        seldepth: 0,
        nodes: 0,
        eval: '-',
        winrate: 0.0,
        bestline: [],
      },
    ],
    nodes: 0,
    speed: 0,
    time: 0,
    msg: null,
    realtime: {
      best: [],
      lost: [],
    },
    forbid: [],
    error: null,
  },
  messages: [],
  posCallback: null,
}

const getters = {
  bestlineStr: (state) => (pvIdx) => {
    if (!pvIdx) pvIdx = 0
    let posStrs = []
    for (let p of state.outputs.pv[pvIdx].bestline) {
      const coordX = String.fromCharCode('A'.charCodeAt(0) + p[0])
      const coordY = (state.startSize - p[1]).toString()
      posStrs.push(coordX + coordY)
    }
    return posStrs.join(' ')
  },
}

const mutations = {
  setLoadingProgress(state, progress) {
    state.loadingProgress = progress
  },
  setReady(state, ready) {
    state.ready = ready
  },
  setThinkingState(state, thinking) {
    state.thinking = thinking
  },
  setStartSize(state, size) {
    state.startSize = size
  },
  setRestart(state, enabled = true) {
    state.restart = enabled
  },
  clearUsedTime(state) {
    state.timeUsed = 0
  },
  addUsedTime(state) {
    state.timeUsed += Date.now() - state.lastThinkTime
  },
  setThinkStartTime(state) {
    state.lastThinkTime = Date.now()
  },
  setCurrentConfig(state, config) {
    state.currentConfig = config
  },
  setHashSize(state, hashSize) {
    state.hashSize = hashSize
  },
  addMessage(state, msg) {
    state.messages.push(msg)
  },
  clearMessage(state) {
    state.messages = []
  },
  setOutput(state, output) {
    state.outputs[output.key] = output.value
  },
  setCurrentPV(state, pvIdx) {
    state.outputs.currentPV = pvIdx
  },
  setPVOutput(state, output) {
    let pv = state.outputs.pv[state.outputs.currentPV]
    if (!pv) {
      state.outputs.pv[state.outputs.currentPV] = {}
      pv = state.outputs.pv[state.outputs.currentPV]
    }
    pv[output.key] = output.value
  },
  clearOutput(state) {
    state.outputs.pv = [
      {
        depth: 0,
        seldepth: 0,
        nodes: 0,
        eval: '-',
        winrate: 0.0,
        bestline: [],
      },
    ]
    state.outputs.pos = null
    state.outputs.nodes = 0
    state.outputs.speed = 0
    state.outputs.forbid = []
  },
  addRealtime(state, rt) {
    state.outputs.realtime[rt.type].push(rt.pos)
  },
  clearRealtime(state, type) {
    state.outputs.realtime[type] = []
  },
  setPosCallback(state, callback) {
    state.posCallback = callback
  },
  sortPV(state) {
    let isPosEqual = (m) =>
      state.outputs.pos ? m[0] == state.outputs.pos[0] && m[1] == state.outputs.pos[1] : false
    let evalStrToEval = (e) => {
      let val = +e
      if (isNaN(val)) {
        if (e.startsWith('+M')) val = 40000 - +e.substring(2)
        else if (e.startsWith('-M')) val = -40000 + +e.substring(2)
        else val = -80000
      }
      return val
    }

    state.outputs.pv.sort((a, b) => {
      if (isPosEqual(a.bestline[0])) return -1
      else if (isPosEqual(b.bestline[0])) return 1
      return evalStrToEval(b.eval) - evalStrToEval(a.eval)
    })
  },
  setLastThinkPosition(state, position) {
    state.lastThinkPosition = [...position]
  },
}

const actions = {
  async initEngine({ commit, dispatch, state }) {
    commit('setLoadingProgress', 0.0)
    commit('setReady', false)
    const callback = (r) => {
      if (r.realtime) {
        switch (r.realtime.type) {
          case 'LOST':
            commit('addRealtime', { type: 'lost', pos: r.realtime.pos })
            break
          case 'BEST':
            commit('clearRealtime', 'best')
            commit('addRealtime', { type: 'best', pos: r.realtime.pos })
            break
          default:
            break
        }
      } else if (r.msg) {
        commit('setOutput', { key: 'msg', value: r.msg })
        commit('addMessage', r.msg)
      } else if (r.multipv) {
        if (r.multipv == 'DONE') commit('setCurrentPV', 0)
        else commit('setCurrentPV', +r.multipv)
      } else if (r.depth) {
        commit('setPVOutput', { key: 'depth', value: r.depth })
      } else if (r.seldepth) {
        commit('setPVOutput', { key: 'seldepth', value: r.seldepth })
      } else if (r.nodes) {
        commit('setPVOutput', { key: 'nodes', value: r.nodes })
      } else if (r.totalnodes) {
        commit('setOutput', { key: 'nodes', value: r.totalnodes })
      } else if (r.totaltime) {
        commit('setOutput', { key: 'time', value: r.totaltime })
      } else if (r.speed) {
        commit('setOutput', { key: 'speed', value: r.speed })
      } else if (r.eval) {
        commit('setPVOutput', { key: 'eval', value: r.eval })
      } else if (r.winrate) {
        commit('setPVOutput', { key: 'winrate', value: r.winrate })
      } else if (r.bestline) {
        commit('setPVOutput', { key: 'bestline', value: r.bestline })
      } else if (r.pos) {
        commit('setOutput', { key: 'pos', value: r.pos })
        commit('addUsedTime')
        commit('clearRealtime', 'best')
        commit('clearRealtime', 'lost')
        commit('sortPV')
        commit('setThinkingState', false)
        if (state.posCallback) state.posCallback(r.pos)
      } else if (r.swap) {
        commit('setOutput', { key: 'swap', value: r.swap })
      } else if (r.forbid) {
        commit('setOutput', { key: 'forbid', value: r.forbid })
      } else if (r.error) {
        commit('setOutput', { key: 'error', value: r.error })
        commit('addMessage', 'Error: ' + r.error)
      } else if (r.ok) {
        commit('addMessage', 'Engine ready.')
        commit('setReady', true)
        dispatch('checkForbid')
      } else if (r.loading) {
        commit('setLoadingProgress', r.loading.progress)
      }
    }
    const engineURL = await engine.init(callback)
    commit('addMessage', 'Engine: ' + engineURL)
  },
  sendInfo({ rootState, rootGetters }) {
    engine.sendCommand('INFO RULE ' + rootState.settings.rule)
    engine.sendCommand('INFO THREAD_NUM ' + (rootState.settings.threads || 1))
    engine.sendCommand('INFO CAUTION_FACTOR ' + rootState.settings.candRange)
    engine.sendCommand('INFO STRENGTH ' + rootState.settings.strength)
    engine.sendCommand('INFO TIMEOUT_TURN ' + rootGetters['settings/turnTime'])
    engine.sendCommand('INFO TIMEOUT_MATCH ' + rootGetters['settings/matchTime'])
    engine.sendCommand('INFO MAX_DEPTH ' + rootGetters['settings/depth'])
    engine.sendCommand('INFO MAX_NODE ' + rootGetters['settings/nodes'])
    engine.sendCommand('INFO SHOW_DETAIL ' + (rootState.settings.showDetail ? 3 : 2))
    engine.sendCommand('INFO PONDERING ' + (rootState.settings.pondering ? 1 : 0))
    engine.sendCommand('INFO SWAPABLE ' + (rootState.position.swaped ? 0 : 1))
  },
  sendBoard({ rootState }, immediateThink) {
    let position = rootState.position.position

    let command = immediateThink ? 'BOARD' : 'YXBOARD'
    let side = position.length % 2 == 0 ? 1 : 2
    for (let pos of position) {
      command += ' ' + pos[0] + ',' + pos[1] + ',' + side
      side = 3 - side
    }
    command += ' DONE'
    engine.sendCommand(command)
  },
  think({ commit, dispatch, state, rootState, rootGetters }, args) {
    if (!state.ready) {
      commit('addMessage', 'Engine is not ready!')
      return Promise.reject(new Error('Engine is not ready!'))
    }
    commit('setThinkingState', true)
    commit('setOutput', { key: 'swap', value: false })
    commit('clearMessage')

    dispatch('reloadConfig')
    dispatch('updateHashSize')
    dispatch('sendInfo')

    if (state.restart || state.startSize != rootState.position.size) {
      engine.sendCommand('START ' + rootState.position.size)
      commit('setRestart', false)
      commit('setStartSize', rootState.position.size)
      commit('clearUsedTime')
    }

    let timeLeft = Math.max(rootGetters['settings/matchTime'] - state.timeUsed, 1)
    engine.sendCommand('INFO TIME_LEFT ' + timeLeft)

    dispatch('sendBoard', false)
    commit('setThinkStartTime')
    commit('setLastThinkPosition', rootState.position.position)
    commit('clearOutput')

    if (args && args.balanceMode) {
      engine.sendCommand(
        (args.balanceMode == 2 ? 'YXBALANCETWO ' : 'YXBALANCEONE ') + (args.balanceBias || 0)
      )
    } else {
      engine.sendCommand('YXNBEST ' + rootState.settings.nbest)
    }

    return new Promise((resolve) => {
      commit('setPosCallback', resolve)
    })
  },
  stop({ commit, state }) {
    if (!state.thinking) return

    if (engine.stopThinking()) {
      commit('setReady', false)
      commit('clearRealtime', 'best')
      commit('clearRealtime', 'lost')
      commit('addUsedTime')
      commit('sortPV')
      commit('setThinkingState', false)
      let pos = state.outputs.pv[0].bestline[0]
      if (pos) {
        commit('setOutput', { key: 'pos', value: pos })
        if (state.posCallback) state.posCallback(pos)
      }
      commit('setRestart')
      // Reset to initial state
      commit('setCurrentConfig', null)
      commit('setHashSize', null)
      return true
    }

    return false
  },
  restart({ commit }) {
    commit('setRestart')
    commit('clearUsedTime')
    commit('clearOutput')
  },
  reloadConfig({ commit, state, rootState }) {
    if (rootState.settings.configIndex == state.currentConfig) return
    commit('setCurrentConfig', rootState.settings.configIndex)

    engine.sendCommand('RELOADCONFIG ' + (CONFIGS[state.currentConfig] || ''))
  },
  updateHashSize({ commit, state, rootState }) {
    if (rootState.settings.hashSize == state.hashSize) return
    commit('setHashSize', rootState.settings.hashSize)

    engine.sendCommand('INFO HASH_SIZE ' + state.hashSize * 1024)
    commit('addMessage', `Hash size reset to ${state.hashSize} MB.`)
  },
  checkForbid({ commit, state, dispatch, rootState, rootGetters }) {
    commit('setOutput', { key: 'forbid', value: [] })
    if (!state.ready) return

    if (rootGetters['settings/gameRule'] == RENJU) {
      dispatch('sendInfo')
      if (state.restart || state.startSize != rootState.position.size) {
        engine.sendCommand('START ' + rootState.position.size)
        commit('setRestart', false)
        commit('setStartSize', rootState.position.size)
      }
      dispatch('sendBoard', false)
      engine.sendCommand('YXSHOWFORBID')
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
