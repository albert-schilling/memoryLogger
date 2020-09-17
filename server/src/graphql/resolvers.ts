import { IResolvers } from 'apollo-server-express'
import { sessionId } from '../index'
import { memoryLog } from '../memoryLog'
import fs from 'fs'
import { recalculateSessionAverage } from './helpers/calculateAverage'
import { calculateDivergence } from './helpers/divergence'
import {
  PROPERTIES,
  TMemoryLog,
  TMemoryStatus,
  TMemoryStatusReduced,
  TRecordOfNumbers,
  TRecordOfStringOrNumbers,
} from '../types'
import { GROWTH_LIMIT } from '../Constants'
import {
  numberizeObjectValues,
  stringifyObjectValues,
  removeKeys,
} from './helpers/objectModification'
import { simpleLinearRegression } from './helpers/simpleLinearRegression'
import {
  sendDailyMail,
  sendMailWithMemoryStatus,
  sendMemoryLeakageMail,
} from './services/sendMail'

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
    logMemory: (_root: undefined, { log }: TLogMemoryInput): void => {
      console.log('[app]: Received mutation for memory logs.')
      const sessionLog = log
      const sessionLogForCalculation = removeKeys(sessionLog, [
        PROPERTIES.clientTimestamp,
        PROPERTIES.location,
      ]) as TMemoryStatusReduced
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
        const newAverage = recalculateSessionAverage(
          currentAverage,
          sessionLogForCalculation
        )
        currentSession.average = newAverage
        const divergence = calculateDivergence(
          numberizeObjectValues(currentAverage) as TRecordOfNumbers,
          numberizeObjectValues(sessionLogForCalculation) as TRecordOfNumbers
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
    },
    sendMemory: (_root: undefined, { log }: TLogMemoryInput): void => {
      console.log('[app]: Received request to send mail with given memory log.')
      sendMailWithMemoryStatus(log)
    },
  },
}
