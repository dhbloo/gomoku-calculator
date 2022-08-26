import Worker from './engine-warpper.worker.js'
import { checkSharedArrayBufferSupport } from './util'
import { script } from '@/../node_modules/dynamic-import/dist/import.js'

const EngineTypeEnum = {
  WebAssembly: 0,
  WebAssemblyWorker: 1,
}

const MTEngineURL = process.env.BASE_URL + 'build/rapfi-multi.js'
const STEngineURL = process.env.BASE_URL + 'build/rapfi-single.js'
const EngineType = checkSharedArrayBufferSupport()
  ? EngineTypeEnum.WebAssembly
  : EngineTypeEnum.WebAssemblyWorker
var callback, engineInstance

// Init engine and setup callback function for receiving engine output
function init(f) {
  callback = f

  if (EngineType == EngineTypeEnum.WebAssembly) {
    script
      .import(/* webpackIgnore: true */ MTEngineURL)
      .then(function () {
        let engineDirURL = MTEngineURL.substring(0, MTEngineURL.lastIndexOf('/') + 1)
        self['Rapfi']({
          locateFile: (url) => engineDirURL + url,
          receiveStdout: (o) => processOutput(o),
          receiveStderr: () => {},
          onEngineReady: () => callback({ ok: true }),
        })
          .then((instance) => (engineInstance = instance))
          .catch((err) => console.error('Failed to load engine module: ' + err))
      })
      .catch((err) => console.error('Failed to import MTEngine: ' + err))
  } else if (EngineType == EngineTypeEnum.WebAssemblyWorker) {
    engineInstance = new Worker()
    engineInstance.onmessage = function (e) {
      if (e.data.ready != null) callback({ ok: true })
      else if (e.data.stdout != null) processOutput(e.data.stdout)
    }
    engineInstance.onerror = function (err) {
      engineInstance.terminate()
      console.error('Worker error [' + err.message + ']. Retry after 250ms...')
      setTimeout(() => init(f), 250)
    }
    engineInstance.postMessage({ engineScriptURL: STEngineURL })
  } else throw new Error('Invalid engine type: ' + EngineType)
}

// Stop current engine's thinking process
// Returns true if force stoped, otherwise returns false
function stopThinking() {
  if (EngineType == EngineTypeEnum.WebAssembly) {
    sendCommand('YXSTOP')
    return false
  } else if (EngineType == EngineTypeEnum.WebAssemblyWorker) {
    console.warn('No support for SAB, will stop by terminating worker.')
    engineInstance.terminate()
    init(callback) // Use previous callback function
    return true
  }
}

// Send a command to engine
function sendCommand(cmd) {
  if (typeof cmd !== 'string' || cmd.length == 0) return

  if (EngineType == EngineTypeEnum.WebAssembly) engineInstance.sendCommand(cmd)
  else if (EngineType == EngineTypeEnum.WebAssemblyWorker)
    engineInstance.postMessage({ command: cmd })
}

// process output from engine and call callback function
function processOutput(output) {
  let i = output.indexOf(' ')

  if (i == -1) {
    if (output == 'OK') return
    else if (output == 'SWAP') callback({ swap: true })
    else {
      let coord = output.split(',')
      callback({ pos: [+coord[0], +coord[1]] })
    }
    return
  }

  let head = output.substring(0, i)
  let tail = output.substring(i + 1)

  if (head == 'MESSAGE') {
    if (tail.startsWith('REALTIME')) {
      let r = tail.split(' ')
      if (r.length < 3) {
        callback({
          realtime: {
            type: r[1],
          },
        })
      } else {
        let coord = r[2].split(',')
        callback({
          realtime: {
            type: r[1],
            pos: [+coord[0], +coord[1]],
          },
        })
      }
    } else {
      callback({ msg: tail })
    }
  } else if (head == 'INFO') {
    i = tail.indexOf(' ')
    head = tail.substring(0, i)
    tail = tail.substring(i + 1)

    if (head == 'PV') callback({ multipv: tail })
    else if (head == 'NUMPV') callback({ numpv: +tail })
    else if (head == 'DEPTH') callback({ depth: +tail })
    else if (head == 'SELDEPTH') callback({ seldepth: +tail })
    else if (head == 'NODES') callback({ nodes: +tail })
    else if (head == 'TOTALNODES') callback({ totalnodes: +tail })
    else if (head == 'TOTALTIME') callback({ totaltime: +tail })
    else if (head == 'SPEED') callback({ speed: +tail })
    else if (head == 'EVAL') callback({ eval: tail })
    else if (head == 'WINRATE') callback({ winrate: parseFloat(tail) })
    else if (head == 'BESTLINE')
      callback({
        bestline: tail.match(/([A-Z]\d+)/g).map((s) => {
          let coord = s.match(/([A-Z])(\d+)/)
          let x = coord[1].charCodeAt(0) - 'A'.charCodeAt(0)
          let y = +coord[2] - 1
          return [x, y]
        }),
      })
  } else if (head == 'ERROR') callback({ error: tail })
  else if (head == 'FORBID')
    callback({
      forbid: (tail.match(/.{4}/g) || []).map((s) => {
        let coord = s.match(/([0-9][0-9])([0-9][0-9])/)
        let x = +coord[1]
        let y = +coord[2]
        return [x, y]
      }),
    })
  else callback({ unknown: tail })
}

export { init, sendCommand, stopThinking }
