import * as React from 'react'
import StartMemoryLogger from './StartMemoryLogger'
import SendMemory from './SendMemory'

export default function App() {
  return (
      <div style={{ display: 'grid', gridGap: '8px', width: 'max-content' }}>
        <h2>Log your client's memory useage and catch that memory leak! 🚀</h2>
        <StartMemoryLogger />
        <SendMemory/>
      </div>
  )
}
