if (typeof Module === 'undefined') {
  // Bridge object for writing stdin & reading stdout
  var Bridge =
    typeof Bridge !== 'undefined'
      ? Bridge
      : {
          ready: false,
          writeStdin() {},
          readStdout() {},
          setReady() {
            this.ready = true
          }
        }

  // Setup webassembly glue module (only for main thread)
  var Module = {
    preRun: [
      function() {
        let input = {
          str: '',
          index: 0,
          set: function(str) {
            this.str = str + '\n'
            this.index = 0
          }
        }

        let output = {
          str: '',
          flush: function() {
            Bridge.readStdout(this.str)
            this.str = ''
          }
        }

        function stdin() {
          // Return ASCII code of character, or null if no input
          let char = input.str.charCodeAt(input.index++)
          return isNaN(char) ? null : char
        }

        function stdout(char) {
          if (!char || char == '\n'.charCodeAt(0)) {
            output.flush()
          } else {
            output.str += String.fromCharCode(char)
          }
        }

        FS.init(stdin, stdout, stdout)
        let pipeLoopOnce = Module.cwrap('gomocupLoopOnce', 'number', [])
        Bridge.writeStdin = function(data) {
          input.set(data)
          pipeLoopOnce()
        }
      }
    ],
    onRuntimeInitialized() {
      Bridge.setReady()
    }
  }

  // If we are running in a worker, setup onmessage & postMessage
  if (typeof importScripts === 'function') {
    self.onmessage = function(e) {
      Bridge.writeStdin(e.data)
    }
    Bridge.readStdout = function(data) {
      postMessage({ output: data })
    }
    Bridge.setReady = function() {
      postMessage({ ready: true })
    }
  } else {
    // Otherwise we are running in the main window, adjust URL
    Module.locateFile = function(url) {
      return '/build/' + url
    }
    Module.mainScriptUrlOrBlob = '/build/rapfi-multi.js'
  }
}
