import * as React from 'react'

export default function LogMemory() {

  const query = `mutation logMemory($log: LogDataInput!) {
  logMemory(log: $log)
}`

// Expand the functionality in an extra commit to send version and other stuff necessary for the logging.

  const returnMemory = () => {
    const memory = (window.performance as any).memory
    if (memory) {
      const memoryStatus = {
        clientTimestamp: `${Date.now()}`,
        jsHeapSizeLimit: `${memory?.jsHeapSizeLimit}`,
        totalJSHeapSize: `${memory?.totalJSHeapSize}`,
        usedJSHeapSize: `${memory?.usedJSHeapSize}`,
      }
      return memoryStatus
    } else {
      return 'This feature is only available in Chrome.'
    }
  }

  const [status, setStatus] = React.useState(null)

  const logMemory = (event) => {
    setStatus(null)
    console.log('logMemory called')
    event.preventDefault()
    const memoryStatus = returnMemory()
    if (typeof memoryStatus === 'string') {
      console.error(memoryStatus)
      setStatus(false)
      return
    }

    fetch('http://192.168.184.1:9000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { log: memoryStatus } }),
    })
      .then(() => setStatus(true))
      .catch((error) => {
        setStatus(false)
        console.error({ error })
      })
  }

  return (
    <div>
      <button type="submit" onClick={logMemory}>
        Log Memory
      </button>
      {status === true && <p> Memory successfully logged to server.</p>}
      {status === false && <p> Memory could not be logged to server.</p>}
    </div>
  )
}

export type TMemoryStatus = {
  clientTimestamp: number
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
}
