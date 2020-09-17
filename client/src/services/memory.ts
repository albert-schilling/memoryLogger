import { TMemoryStatus } from '../types'

export function returnMemory(): Error | TMemoryStatus {
  const location = window.location.href
  const memory = (window.performance as any).memory
  if (memory) {
    const memoryStatus = {
      clientTimestamp: String(Date.now()),
      jsHeapSizeLimit: String(memory?.jsHeapSizeLimit),
      totalJSHeapSize: String(memory?.totalJSHeapSize),
      usedJSHeapSize: String(memory?.usedJSHeapSize),
      location
    }
    return memoryStatus
  } else {
    const error = new Error('This feature is only available in Chrome.')
    console.error(error)
    return error
  }
}