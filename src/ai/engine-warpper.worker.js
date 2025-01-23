var EngineInstance = null

function locateFile(url, engineDirURL) {
  // Redirect 'rapfi.*\.data' to 'rapfi.data'
  if (/^rapfi.*\.data$/.test(url)) url = 'rapfi.data'
  return engineDirURL + url
}

self.onmessage = function (e) {
  const { type, data } = e.data
  if (type == 'command') {
    EngineInstance.sendCommand(data)
  } else if (type == 'engineScriptURL') {
    const engineDirURL = data.substring(0, data.lastIndexOf('/') + 1)
    self.importScripts(data)

    self['Rapfi']({
      locateFile: (url) => locateFile(url, engineDirURL),
      onReceiveStdout: (o) => self.postMessage({ type: 'stdout', data: o }),
      onReceiveStderr: (o) => self.postMessage({ type: 'stderr', data: o }),
      onExit: (c) => self.postMessage({ type: 'exit', data: c }),
      setStatus: (s) => self.postMessage({ type: 'status', data: s }),
    }).then((instance) => ((EngineInstance = instance), self.postMessage({ type: 'ready' })))
  } else {
    console.error('worker received unknown payload: ' + e.data)
  }
}
