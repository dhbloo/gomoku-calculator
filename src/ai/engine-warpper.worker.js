var EngineInstance = null

self.onmessage = function (e) {
  if (e.data.command != null) {
    EngineInstance.sendCommand(e.data.command)
  } else if (e.data.engineScriptURL != null) {
    let engineScriptURL = e.data.engineScriptURL
    let engineDirURL = engineScriptURL.substring(0, engineScriptURL.lastIndexOf('/') + 1)
    self.importScripts(engineScriptURL)

    self['Rapfi']({
      locateFile: (url) => engineDirURL + url,
      receiveStdout: (o) => self.postMessage({ stdout: o }),
      receiveStderr: (o) => self.postMessage({ stderr: o }),
      onEngineReady: () => self.postMessage({ ready: true }),
    })
      .then((instance) => (EngineInstance = instance))
      .catch((err) => console.error('Failed to load engine module: ' + err))
  } else {
    console.warn('worker received unknown data:' + e.data)
  }
}
