import { transporter } from "../.."
import { DEFAULT_MEMORY_MAIL } from "../../Constants"

type SendMailProps ={
    to: string[], from: string, subject: string, html: string,  
} 
/**
 *Function that sends an email with the provided options if the mail transporter is properly configured.
 */
export function sendMail({to, from, subject, html}: SendMailProps ): void {
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
  