import * as React from 'react'
import { useState, useEffect } from 'react'

/**
 * Component that sends a memory status every set interval (default interval is per hour) to the server with the given IP address.
 */
export default function StartMemoryLogger() {
  const [status, setStatus] = React.useState(null)

  const [serverAddress, setServerAddress] = useState(
    'http://192.168.184.1:9000/api'
  )
  const [isLoggingActive, setLoggingActivity] = useState(false)

  useEffect(() => {
    console.log(isLoggingActive)
    const interval = setInterval(() => {
      isLoggingActive && logMemory().then((res) => setStatus(res))
    }, 3600000)
    return () => clearInterval(interval)
  }, [isLoggingActive])

  // Add stop memory loggin button
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto auto',
        gridGap: '8px',
        width: 'max-content',
      }}
    >
      <input
        type="text"
        value={serverAddress}
        onChange={(event) => {
          setServerAddress(event.target.value)
        }}
      />
      <button onClick={() => setLoggingActivity(true)}>
        Start Memory Logger
      </button>
      <button onClick={() => setLoggingActivity(false)}>
        Stop Memory Logger
      </button>
      {status === true && <p> Memory successfully logged to server.</p>}
      {status === false && <p> Memory could not be logged to server.</p>}
    </div>
  )
}

export type TMemoryStatus = {
  clientTimestamp: string
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
}

function logMemory(ip = 'http://192.168.184.1:9000/api'): Promise<boolean> {
  console.log('logMemory called')

  const query = `mutation logMemory($log: LogDataInput!) {
    logMemory(log: $log)
  }`

  const memoryStatus = returnMemory()
  if (typeof memoryStatus === 'string') {
    console.error(memoryStatus)
    return new Promise(() => false)
  }

  return fetch('http://192.168.184.1:9000/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { log: memoryStatus } }),
  })
    .then(() => true)
    .catch((error) => {
      console.error({ error })
      return false
    })
}

/**
 * Function that sends a memory status every given interval (default interval is per hour) to the server with the given IP address,
 * and returns the index of the interval.
 *
 * Function can be stopped with `clearInterval(<interval_index>)`.
 */
export function startMemoryLogging(interval = 360000): number {
  return setInterval(() => {
    logMemory()
  }, interval)
}

function returnMemory(): string | TMemoryStatus {
  const memory = (window.performance as any).memory
  if (memory) {
    const memoryStatus = {
      clientTimestamp: String(Date.now()),
      jsHeapSizeLimit: String(memory?.jsHeapSizeLimit),
      totalJSHeapSize: String(memory?.totalJSHeapSize),
      usedJSHeapSize: String(memory?.usedJSHeapSize),
    }
    return memoryStatus
  } else {
    const error = new Error('This feature is only available in Chrome.')
    console.error(error)
    return error.message
  }
}
startMemoryLogging.description = `Function that sends a memory status every given interval (default interval is per hour) to the server with the given IP address, and returns the index of the interval. 
Function can be stopped with clearInterval(<interval_index>).`

window.startMemoryLogging = startMemoryLogging

// TODO: add window script that
