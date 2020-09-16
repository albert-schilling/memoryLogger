import {render} from 'react-dom'
import * as React from 'react'
import App from './App'

(window as any).printMemory = () => {
    const memory = (window.performance as any).memory
    if (memory) {
      const memoryStatus = {
        clientTime: Date.now(),
        jsHeapSizeLimit: memory?.jsHeapSizeLimit,
        totalJSHeapSize: memory?.totalJSHeapSize,
        usedJSHeapSize: memory?.usedJSHeapSize,
      }
      return JSON.stringify(memoryStatus)
    } else {
      return new Error('This feature is only available in Chrome.')
    }
  }
  


render(<App />, document.getElementById('root'))