import * as React from 'react'
import { sendMemory } from './services/sendMemory'
import { useState } from 'react'

export default function SendMemory() {
  const [status, setStatus] = useState(null)

  const handleSendMemory = event => {
    event.preventDefault()
    setStatus(null)
    console.log('sendmemory called')
    sendMemory().then(res => setStatus(res))
  }

  return (
    <div>
      <button type="submit" onClick={handleSendMemory}>
        Send Memory
      </button>
      {status === true && <p> Mail successfully send.</p>}
      {status === false && <p> Mail could not be send.</p>}
    </div>
  )
}