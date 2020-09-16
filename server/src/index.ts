import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from './graphql'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import cors from 'cors'
import readline from 'readline'

const app = express()
app.use(cors())
const port = 9000

const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app, path: '/api' })

app.listen(port)

export const sessionId = `${Date.now()}`

console.log(`[app]: server started at http://localhost:${port}`)
console.log(`[app]: session id: `, sessionId)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

type mailServerDataProps = {
  running: boolean
  server: string
  address: string
  password: string
}

export const mailServerData: mailServerDataProps = {
  running: false,
  server: '',
  address: '',
  password: '',
}

export let transporter: Mail

initalizeMailServer()

function initalizeMailServer() {
  console.log(
    '[app]: To enable memory leak notification via mail, you need to type in your mail server, address and password.'
  )
  rl.question('[app]: Would you like to proceed? (y/n)', (res) => {
    if (res === 'y' || res === 'Y') {
      rl.question('[app]: Please, type in your mail server:', (res) => {
        mailServerData.server = res
        rl.question('[app]: Please, type in your mail address:', (res) => {
          mailServerData.address = res
          rl.question('[app]: Please, type in your mail password:', (res) => {
            mailServerData.password = res
            initializeTransporter({ ...mailServerData })
            rl.close()
          })
        })
      })
    } else {
      console.log('[app]: Server is running without notifications via mail.')
      rl.close()
    }
  })
}

function initializeTransporter({
  server,
  address,
  password,
}: Omit<mailServerDataProps, 'confirmation'>) {
  transporter = nodemailer.createTransport({
    // host: 'mail.gmx.net',
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
      rl.question(
        '[app]: Would you like to reconfigure the mail transporter? (y/n)',
        (res) => {
          if (res === 'y' || res === 'Y') {
            initalizeMailServer()
          } else {
            console.log(
              '[app]: Server is running without notifications via mail.'
            )
          }
        }
      )
    } else {
      console.log(
        '[app]: Server is ready to send out notifications via mail:',
        success
      )
      mailServerData.running = true
    }
  })
}

rl.on('close', function () {
  console.log('[app]: Closing mail transporter configurator.')
  console.log(`[app]: Ready to log client's memory usage.`)
})
