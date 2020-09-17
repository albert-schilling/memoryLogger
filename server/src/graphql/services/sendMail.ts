import { mailServerData, transporter } from '../..'
import { DEFAULT_MEMORY_MAIL } from '../../Constants'
import { TMemoryAverage, TMemoryStatus } from '../../types'
import {
  memoryLeakageWarningHTML,
  dailyReportHTML,
  memoryLogRequestHTML,
} from '../html'

type SendMailProps = {
  to: string[]
  from: string
  subject: string
  html: string
}
/**
 *Function that sends an email with the provided options if the mail transporter is properly configured.
 */
export function sendMail({ to, from, subject, html }: SendMailProps): void {
  transporter.sendMail(
    { ...DEFAULT_MEMORY_MAIL, to, from, subject, html },
    (error, info) => {
      if (error) {
        console.log(error)
        return '[app]: Error: Mail could not be send'
      }
      console.log('Message sent: %s', info.messageId)
      return '[app]: Mail successfully sent.'
    }
  )
}

/**
 * Function that sends a memory leakage warning email containing information about the client's memory useage: used memory growth, set growth limit and current memory status.
 * Provided the mail transporter is properly configured.
 */
export function sendMemoryLeakageMail({
  gradient,
  growthLimit,
  sessionLog,
}: {
  gradient: number
  growthLimit: number
  sessionLog: TMemoryStatus
}): void {
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
      to: mailServerData.target,
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
export function sendDailyMail({
  gradient,
  growthLimit,
  sessionLog,
  average,
}: {
  gradient: number
  growthLimit: number
  sessionLog: TMemoryStatus
  average: TMemoryAverage
}): void {
  console.log(`[app]: Received 24th memory log in a row.`)
  if (mailServerData.running) {
    console.log(`[app]: Attempting to send an email with daily report.`)
    sendMail({
      to: mailServerData.target,
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

/**
 * Function that sends an email on request with the given memory status.
 * Provided the mail transporter is properly configured.
 */
export function sendMailWithMemoryStatus(sessionLog: TMemoryStatus): void {
  console.log(`[app]: Received request to send memory status via mail.`)
  if (mailServerData.running) {
    console.log(`[app]: Attempting to send email.`)
    sendMail({
      to: mailServerData.target,
      from: mailServerData.address,
      subject: 'Memory Documentation',
      html: memoryLogRequestHTML(sessionLog),
    })
  } else {
    console.log(`[app]: Mail transport not running. Could not send mail.`)
  }
}
