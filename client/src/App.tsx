import * as React from 'react'
import SendMemory from './SendMemory'
import LogMemory from './LogMemory'
import StartMemoryLogger from './StartMemoryLogger'

export default function App() {
  return (
      <div style={{ display: 'grid', gridGap: '8px', width: 'max-content' }}>
        <h2>Log your client's memory useage and catch that memory leak! 🚀</h2>
        {/* <Mail /> */}
        {/* <SendMemory /> */}
        {/* <LogMemory /> */}
        <StartMemoryLogger />
      </div>
  )
}
