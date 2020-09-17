import { ENDPOINT } from '../constants'
import { LOG_MEMORY } from '../queries'
import { returnMemory } from './memory'

export function logMemory(ip = ENDPOINT): Promise<boolean> {
  const memoryStatus = returnMemory()
  if (typeof memoryStatus === 'string') {
    console.error(memoryStatus)
    return new Promise(() => false)
  }

  return fetch(ip, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: LOG_MEMORY, variables: { log: memoryStatus } }),
  })
    .then(res => res.ok)
    .catch(error => {
      console.error({ error })
      return false
    })
}

/**
 * Function that sends a memory status every given interval (default interval is per hour) to the server with the given IP address,
 * and returns the index of the interval.
 *
 * Function can be stopped with `clearInterval(<interval_index>)`.
 */
export function startMemoryLogging(interval = 360000, ip: string): number {
  return setInterval(() => {
    logMemory(ip)
  }, interval)
}

startMemoryLogging.description = `Function that sends a memory status every given interval (default interval is per hour) to the server with the given IP address, and returns the index of the interval. 
Function can be stopped with clearInterval(<interval_index>).`

Object.assign(window, { startMemoryLogging })