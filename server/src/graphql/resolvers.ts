import { IResolvers } from 'apollo-server-express'
import { transporter, mailServerData, sessionId } from '../index'
import {
  TMemoryStatus,
  memoryLog,
  TMemoryLog,
  PROPERTIES,
  TMemoryAverage,
} from '../memoryLog'
import fs from 'fs'
import { recalculateSessionAverage } from './helpers/calculateAverage'
import { calculateDivergence } from './helpers/divergence'
import { TRecordOfNumbers, TRecordOfStringOrNumbers } from '../types'
import { GROWTH_LIMIT } from '../Constants'
import { memoryLeakageWarningHTML, dailyReportHTML } from './html'
import {
  numberizeObjectValues,
  stringifyObjectValues,
  removeKeys,
} from './helpers/objectModification'
import { simpleLinearRegression } from './helpers/simpleLinearRegression'
import { sendMail } from './services/sendMail'

type TLogMemoryInput = {
  log: TMemoryStatus
}

export const resolvers: IResolvers = {
  Query: {
    memoryLog: (): TMemoryLog => {
      console.log('[app]: Received query for memory logs.')
      return memoryLog
    },
  },
  Mutation: {
    logMemory: (_root: undefined, { log }: TLogMemoryInput): string => {
      console.log('[app]: Received mutation for memory logs.')
      const sessionLog = log
      if (memoryLog.logs === undefined) {
        console.log(
          '[app]: Logs are empty. Adding logs array and adding first session with first memory status.'
        )
        memoryLog.logs = [
          {
            start: sessionId,
            sessionLogs: [sessionLog],
            average: { number: 1, ...sessionLog },
          },
        ]
      } else if (
        memoryLog.logs[memoryLog.logs.length - 1].start !== sessionId
      ) {
        console.log(
          '[app]: Starting new session and adding first memory status.'
        )
        memoryLog.logs.push({
          start: sessionId,
          sessionLogs: [sessionLog],
          average: { number: 1, ...sessionLog },
        })
      } else {
        console.log('[app]: Pushing new memory status in current session log.')
        const currentSession = memoryLog.logs[memoryLog.logs.length - 1]
        const currentAverage = currentSession.average
        const newAverage = recalculateSessionAverage(currentAverage, sessionLog)
        currentSession.average = newAverage
        const divergence = calculateDivergence(
          numberizeObjectValues(currentAverage) as TRecordOfNumbers,
          numberizeObjectValues(sessionLog) as TRecordOfNumbers
        )
        // const divergentValues = getDivergentValues(divergence, DIVERGENCE_LIMIT)
        sessionLog.divergence = stringifyObjectValues(
          divergence
        ) as TMemoryStatus
        currentSession.sessionLogs?.push(sessionLog)

        const logs = currentSession.sessionLogs.map(
          (o) =>
            removeKeys(o, [PROPERTIES.divergence]) as TRecordOfStringOrNumbers
        )
        const { gradient } = simpleLinearRegression(
          logs,
          PROPERTIES.clientTimestamp,
          PROPERTIES.usedJSHeapSize
        )
        currentSession.growth = String(gradient)
        if (currentSession.sessionLogs.length > 10 && gradient > GROWTH_LIMIT) {
          sendMemoryLeakageMail({
            gradient,
            growthLimit: GROWTH_LIMIT,
            sessionLog,
          })
        }
        if (currentSession.sessionLogs.length % 24 === 0) {
          sendDailyMail({
            gradient,
            growthLimit: GROWTH_LIMIT,
            sessionLog,
            average: currentSession.average,
          })
        }
      }
      fs.writeFileSync('./data/memoryLog.json', JSON.stringify(memoryLog))
      return 'Memory logged.'
    },
    sendMail: (_root: undefined, { message }): void => {
      if (mailServerData.running) {
        transporter.sendMail(
          {
            ...message,
            to: mailServerData.address,
            from: mailServerData.address,
          },
          (error, info) => {
            if (error) {
              console.log('[app]: ', error)
            }
            console.log('[app]: Message sent: %s', info.messageId)
          }
        )
      } else {
        console.error(
          '[app]: Error: Client asked to send mails, but mail transporter is not running.'
        )
      }
    },
  },
}

/**
 * Function that sends a memory leakage warning email containing information about the client's memory useage: used memory growth, set growth limit and current memory status.
 * Provided the mail transporter is properly configured.
 */
function sendMemoryLeakageMail({
  gradient,
  growthLimit,
  sessionLog,
}: {
  gradient: number
  growthLimit: number
  sessionLog: TMemoryStatus
}) {
  console.log(`[app]: Current session has an estimated growth of ${gradient},`)
  console.log(
    `[app]: which is ${
      growthLimit - gradient
    } above the current growth limit of ${growthLimit}.`
  )
  if (mailServerData.running) {
    console.log(
      `[app]: Attempting to send an email with memory leakage warning.`
    )
    sendMail({
      to: [mailServerData.address],
      from: mailServerData.address,
      subject: 'Probale Memory Leakage Found!',
      html: memoryLeakageWarningHTML({
        ...sessionLog,
        growth: gradient,
        limit: growthLimit,
      }),
    })
  } else {
    console.log(`[app]: Mail transport not running. Could not send mail.`)
  }
}

/**
 * Function that sends a daily report email containing information about the client's memory useage: current used memory growth, set growth limit, session average and last memory status.
 * Provided the mail transporter is properly configured.
 */
function sendDailyMail({
  gradient,
  growthLimit,
  sessionLog,
  average,
}: {
  gradient: number
  growthLimit: number
  sessionLog: TMemoryStatus
  average: TMemoryAverage
}) {
  console.log(`[app]: Received 24th memory log in a row.`)
  if (mailServerData.running) {
    console.log(`[app]: Attempting to send an email with daily report.`)
    sendMail({
      to: [mailServerData.address],
      from: mailServerData.address,
      subject: 'Probale Memory Leakage Found!',
      html: dailyReportHTML({
        ...sessionLog,
        growth: gradient,
        limit: growthLimit,
        average,
      }),
    })
  } else {
    console.log(`[app]: Mail transport not running. Could not send mail.`)
  }
}
