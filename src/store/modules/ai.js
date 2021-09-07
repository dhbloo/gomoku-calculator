import * as engine from '@/ai/engine'
import { RENJU, CONFIGS } from './settings'

const state = {
  ready: false,
  callbackSet: false,
  startSize: 0,
  restart: false,
  thinking: false,
  timeUsed: 0,
  lastThinkTime: 0,
  lastThinkPosition: [],
  currentConfig: 0,
  hashSize: null,
  outputs: {
    pos: null,
    swap: null,
    currentPV: 0,
    pv: [
      {
        depth: '0-0',
        eval: '-',
        bestline: []
      }
    ],
    nodes: 0,
    speed: 0,
    msg: null,
    realtime: {
      best: [],
      lost: [],
      thinking: [],
      thought: []
    },
    forbid: [],
    error: null
  },
  messages: [],
  posCallback: null
}

const getters = {
  bestlineStr: state => pvIdx => {
    if (!pvIdx) pvIdx = 0
    let posStrs = []
    for (let p of state.outputs.pv[pvIdx].bestline) {
      posStrs.push(String.fromCharCode('A'.charCodeAt(0) + p[0]) + (p[1] + 1))
    }
    return posStrs.join(' ')
  }
}

const mutations = {
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
        depth: '0-0',
        eval: '-',
        bestline: []
      }
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
  callbackSet(state) {
    state.callbackSet = true
  },
  sortPV(state) {
    let isPosEqual = m =>
      state.outputs.pos
        ? m[0] == state.outputs.pos[0] && m[1] == state.startSize - 1 - state.outputs.pos[1]
        : false
    let evalStrToEval = e => {
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
  }
}

const actions = {
  initEngine({ commit, dispatch, state }) {
    engine.init(r => {
      if (r.realtime) {
        switch (r.realtime.type) {
          case 'REFRESH':
            commit('clearRealtime', 'thinking')
            commit('clearRealtime', 'thought')
            break
          case 'POS':
            commit('addRealtime', { type: 'thinking', pos: r.realtime.pos })
            break
          case 'DONE':
            commit('addRealtime', { type: 'thought', pos: r.realtime.pos })
            commit('clearRealtime', 'thinking')
            break
          case 'LOST':
            commit('addRealtime', { type: 'lost', pos: r.realtime.pos })
            break
          case 'BEST':
            commit('clearRealtime', 'best')
            commit('addRealtime', { type: 'best', pos: r.realtime.pos })
            break
        }
      } else if (r.msg) {
        commit('setOutput', { key: 'msg', value: r.msg })
        commit('addMessage', r.msg)
      } else if (r.depth) {
        commit('setPVOutput', { key: 'depth', value: r.depth })
      } else if (r.eval) {
        commit('setPVOutput', { key: 'eval', value: r.eval })
      } else if (r.bestline) {
        commit('setPVOutput', { key: 'bestline', value: r.bestline })
      } else if (r.nodes) {
        commit('setOutput', { key: 'nodes', value: r.nodes })
      } else if (r.speed) {
        commit('setOutput', { key: 'speed', value: r.speed })
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
      } else if (r.ok) {
        commit('setReady', true)
        dispatch('checkForbid')
      } else if (r.multipv) {
        if (r.multipv.startsWith('BEGIN')) commit('setCurrentPV', +r.multipv.substring(6))
        else commit('setCurrentPV', 0)
      } else if (r.forbid) {
        commit('setOutput', { key: 'forbid', value: r.forbid })
      } else if (r.error) {
        commit('setOutput', { key: 'error', value: r.error })
        commit('addMessage', 'Error: ' + r.error)
      }
    })
    commit('callbackSet')
  },
  sendInfo({ rootState, rootGetters }) {
    engine.sendCommand('INFO RULE ' + rootState.settings.rule)
    engine.sendCommand('INFO THREAD_NUM ' + rootState.settings.threads)
    engine.sendCommand('INFO STRENGTH ' + rootState.settings.strength)
    engine.sendCommand('INFO TIMEOUT_TURN ' + rootGetters['settings/turnTime'])
    engine.sendCommand('INFO TIMEOUT_MATCH ' + rootGetters['settings/matchTime'])
    engine.sendCommand('INFO MAX_DEPTH ' + rootGetters['settings/depth'])
    engine.sendCommand('INFO MAX_NODE ' + rootGetters['settings/nodes'])
    engine.sendCommand('INFO SHOW_DETAIL ' + (rootState.settings.showDetail ? 1 : 0))
    engine.sendCommand('INFO PONDERING ' + (rootState.settings.pondering ? 1 : 0))
    engine.sendCommand('INFO SWAPABLE ' + (rootState.position.swaped ? 0 : 1))
  },
  sendBoard({ rootState }, immediateThink) {
    let position = rootState.position.position

    let command = immediateThink ? 'BOARD' : 'YXBOARD'
    for (let pos of position) {
      command += ' ' + pos[0] + ',' + pos[1]
    }
    command += ' DONE'
    engine.sendCommand(command)
  },
  think({ commit, dispatch, state, rootState, rootGetters }, args) {
    if (!state.ready) {
      commit('addMessage', 'Engine is not ready!')
      return
    }
    // if (!state.callbackSet) dispatch("initEngine")
    commit('setThinkingState', true)
    commit('setOutput', { key: 'swap', value: false })
    commit('clearMessage')

    if (state.restart || state.startSize != rootState.position.size) {
      engine.sendCommand('START ' + rootState.position.size)
      commit('setRestart', false)
      commit('setStartSize', rootState.position.size)
      commit('clearUsedTime')
    }

    dispatch('reloadConfig')
    dispatch('updateHashSize')
    dispatch('sendInfo')
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

    return new Promise(resolve => {
      commit('setPosCallback', resolve)
    })
  },
  stop({ commit, state }) {
    if (!state.thinking) return

    if (engine.stopThinking()) {
      commit('setReady', false)
      commit('clearRealtime', 'best')
      commit('clearRealtime', 'lost')
      commit('clearRealtime', 'thinking')
      commit('clearRealtime', 'thought')
      commit('addUsedTime')
      commit('sortPV')
      commit('setThinkingState', false)
      let pos = state.outputs.pv[0].bestline[0]
      if (pos) {
        pos = [pos[0], state.startSize - 1 - pos[1]] // 显示的坐标与输出的坐标在y轴翻转
        commit('setOutput', { key: 'pos', value: pos })
        if (state.posCallback) state.posCallback(pos)
      }
      commit('setRestart')
      // Reset to initial state
      commit('setCurrentConfig', 0)
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

    let numKHashEntries = 1 << state.hashSize
    engine.sendCommand('INFO HASH_SIZE ' + numKHashEntries)
    commit('addMessage', `Hash size reset to ${numKHashEntries >> 7} MB.`)
  },
  checkForbid({ commit, state, dispatch, rootState, rootGetters }) {
    commit('setOutput', { key: 'forbid', value: [] })
    if (!state.ready) return

    if (rootGetters['settings/gameRule'] == RENJU) {
      if (state.restart || state.startSize != rootState.position.size) {
        engine.sendCommand('START ' + rootState.position.size)
        commit('setRestart', false)
        commit('setStartSize', rootState.position.size)
      }
      dispatch('sendInfo')
      dispatch('sendBoard', false)
      engine.sendCommand('YXSHOWFORBID')
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
