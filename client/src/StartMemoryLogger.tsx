import * as React from 'react'
import { useState, useEffect } from 'react'
import { ENDPOINT } from './constants'
import { logMemory } from './services/logMemory'

/**
 * Component that sends a memory status every set interval (default interval is per hour) to the server with the given IP address.
 */
export default function StartMemoryLogger() {
  const [status, setStatus] = useState(null)

  const [serverAddress, setServerAddress] = useState(
    ENDPOINT
  )
  const [isLoggingActive, setLoggingActivity] = useState(false)

  useEffect(() => {
    console.log(isLoggingActive)
    isLoggingActive && logMemory().then((res) => setStatus(res))
    const interval = setInterval(() => {
      isLoggingActive && logMemory().then((res) => setStatus(res))
    }, 500)
    return () => clearInterval(interval)
  }, [isLoggingActive])

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