// Check whether SharedArrayBuffer is supported
export function checkSharedArrayBufferSupport() {
  // Do not request cross origin isolated now
  // as it is not widely support on all browsers
  //if (!self.crossOriginIsolated) return false

  let supportSAB = typeof self.SharedArrayBuffer !== 'undefined'
  if (supportSAB) {
    let tempMemory = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true })
    supportSAB = tempMemory.buffer instanceof self.SharedArrayBuffer
  }
  return supportSAB
}
