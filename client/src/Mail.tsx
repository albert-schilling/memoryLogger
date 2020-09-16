import * as React from 'react'
import { gql, useMutation } from '@apollo/client'

export type TMessage = {
  from: string
  to: string[]
  subject: string
  text?: string
  html?: string
}

export const DEFAULT_ADDRESS = 'albertschilling@gmx.net'


export default function Mail() {
  //   const { loading, error, data } = useQuery(LISTINGS)

  //   if (loading) return <p>Loading...</p>
  //   if (error) return <p>Error :(</p>

  //   return data.listings.map(({ title, price }) => (
  //     <div key={title}>
  //       <p>
  //         {title}: {price}
  //       </p>
  //     </div>
  //   ))


  const initialMessage: TMessage = {
    from: DEFAULT_ADDRESS,
    to: [DEFAULT_ADDRESS],
    subject: 'test mail',
    text: 'Hello there, this is the default message text.',
    html: '<h2>Hello there,</h2><p>this is the default message text.</p>',
  }

  const [message, setMessage] = React.useState(initialMessage)

  const SEND_MAIL = gql`
    mutation sendMail($message: SendMailMessageInput!) {
      sendMail(message: $message)
    }
  `

  const [sendMail, { data }] = useMutation(SEND_MAIL)

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMail({ variables: { message } })
      .then((res) => console.log({ res }))
      .catch((error) => console.error({ error }))
  }

  const handleChange = (event) => {
    const key = event.target.name
    setMessage(
      key === 'text'
        ? {
            ...message,
            [key]: event.target.value,
            html: `<p>${event.target.value}</p>`,
          }
        : { ...message, [key]: event.target.value }
    )
    console.log({ message })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        subject:
        <input
          onChange={handleChange}
          name="subject"
          value={message.subject}
          type="text"
        />
      </label>
      <label>
        text:
        <input
          onChange={handleChange}
          name="text"
          value={message.text}
          type="text"
        />
      </label>
      <button type="submit">Send Mail</button>
    </form>
  )
}
