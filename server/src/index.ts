import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import cors from 'cors'
import readlineSync from 'readline-sync'

const app = express()
app.use(cors())
const port = 9000

const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app, path: '/api' })

app.listen(port)

export const sessionId = `${Date.now()}`

console.log(`[app]: server started at http://localhost:${port}`)
console.log(`[app]: session id: `, sessionId)

const rl = readlineSync

type mailServerDataProps = {
  running: boolean
  server: string
  address: string
  target: string[]
  password: string
}

export const mailServerData: mailServerDataProps = {
  running: false,
  server: '',
  address: '',
  target: [''],
  password: '',
}

export let transporter: Mail

initalizeMailServer()

function initalizeMailServer() {
  console.log(
    '[app]: To enable memory leak notification via mail, you need to type in your mail server, address and password.'
  )

  const startMailConfiguration = rl.question(
    '[app]: Would you like to proceed? (y/n)'
  )

  if (startMailConfiguration === 'y' || startMailConfiguration === 'Y') {
    mailServerData.server = rl.question(
      '[app]: Please, type in your mail server:'
    )
    mailServerData.address = rl.question(
      '[app]: Please, type in your mail address:'
    )

    mailServerData.target = rl.question(
      '[app]: Please, type in the target address. Separate several adressess with comma:'
    ).split(',')

    mailServerData.password = rl.question(
      '[app]: Please, type in your mail password:'
    )

    initializeTransporter({ ...mailServerData })
  } else {
    console.log('[app]: Server is running without notifications via mail.')
    // rl.close()
  }
}

function initializeTransporter({
  server,
  address,
  password,
}: Omit<mailServerDataProps, 'confirmation'>) {
  transporter = nodemailer.createTransport({
    host: server,
    port: 587,
    auth: {
      type: 'login',
      user: address,
      pass: password,
    },
  })

  transporter?.verify(function (error, success) {
    if (error) {
      console.log(
        '[app]: Sorry, the server could not verify your mail address.',
        error.message
      )

      const restartMailConfiguration = rl.question(
        '[app]: Would you like to reconfigure the mail transporter? (y/n)'
      )

      if (
        restartMailConfiguration === 'y' ||
        restartMailConfiguration === 'Y'
      ) {
        initalizeMailServer()
      } else {
        console.log('[app]: Server is running without notifications via mail.')
      }
    } else {
      console.log(
        '[app]: Server is ready to send out notifications via mail:',
        success
      )
      mailServerData.running = true
    }
    console.log('[app]: Closing mail transporter configurator.')
    console.log(`[app]: Ready to log client's memory usage.`)
  })
}

