export const SEND_MEMORY = `mutation sendMemory($log: LogDataInput!) {
    sendMemory(log: $log)
  }`
  
export const LOG_MEMORY = `mutation logMemory($log: LogDataInput!) {
    logMemory(log: $log)
  }`