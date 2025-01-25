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
    const { engineURL, memoryArgs } = data
    const engineDirURL = engineURL.substring(0, engineURL.lastIndexOf('/') + 1)
    self.importScripts(engineURL)

    self['Rapfi']({
      locateFile: (url) => locateFile(url, engineDirURL),
      onReceiveStdout: (o) => self.postMessage({ type: 'stdout', data: o }),
      onReceiveStderr: (o) => self.postMessage({ type: 'stderr', data: o }),
      onExit: (c) => self.postMessage({ type: 'exit', data: c }),
      setStatus: (s) => self.postMessage({ type: 'status', data: s }),
      wasmMemory: memoryArgs ? new WebAssembly.Memory(memoryArgs) : undefined,
    }).then((instance) => ((EngineInstance = instance), self.postMessage({ type: 'ready' })))
  } else {
    console.error('worker received unknown payload: ' + e.data)
  }
}
