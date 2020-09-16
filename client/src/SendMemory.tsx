import * as React from 'react'
import { gql, useMutation } from '@apollo/client'
import { TMessage, DEFAULT_ADDRESS } from './Mail'

export default function SendMemory() {

  // TODO: Update this to use fetch and to define the receiving address.
  const SEND_MAIL = gql`
    mutation sendMail($message: SendMailMessageInput!) {
      sendMail(message: $message)
    }
  `

  const [sendMail, { data }] = useMutation(SEND_MAIL)

  const returnMemory = () => {
    const memory = (window.performance as any).memory
    if (memory) {
      const memoryStatus = {
        clientTime: Date.now(),
        jsHeapSizeLimit: memory?.jsHeapSizeLimit,
        totalJSHeapSize: memory?.totalJSHeapSize,
        usedJSHeapSize: memory?.usedJSHeapSize,
      }
      return memoryStatus
    } else {
      return 'This feature is only available in Chrome.'
    }
  }

  const message: TMessage = {
    from: DEFAULT_ADDRESS,
    to: [DEFAULT_ADDRESS],
    subject: 'Memory Documentation',
    text: 'Hello there, this is a memory documentation.',
    html: '<h2>Hello there,</h2><p>this is the default message text.</p>',
  }

  const [status, setStatus] = React.useState(null)

  const sendMemory = (event) => {
    setStatus(null)
    console.log('sendmemory called')
    event.preventDefault()
    const memoryStatus = returnMemory()
    if (typeof memoryStatus === 'string') {
      console.error(memoryStatus)
      setStatus(false)
      return
    }
    const {
      clientTime,
      jsHeapSizeLimit,
      totalJSHeapSize,
      usedJSHeapSize,
    } = memoryStatus
    const html = `<h2>Memory Documentation</h2>
    <p>client timestamp: ${clientTime}</p>
    <p>client date: ${new Date(clientTime).toDateString()} ${new Date(
      clientTime
    ).toTimeString()}</p>
    <p>JS Heap Size Limit: ${jsHeapSizeLimit}</p>
    <p>total JS Heap Size: ${totalJSHeapSize}</p>
    <p>used JS Heap Size: ${usedJSHeapSize}</p>
    
    `
    // console.log({ WouldSendThisHTML: html })
    sendMail({ variables: { message: { ...message, html } } })
      .then((res) => setStatus(true))
      .catch((error) => {
        setStatus(false)
        console.error({ error })
      })
  }

  return (
    <div>
      <button type="submit" onClick={sendMemory}>
        Send Memory
      </button>
      {status === true && <p> Mail successfully send.</p>}
      {status === false && <p> Mail could not be send.</p>}
    </div>
  )
}
