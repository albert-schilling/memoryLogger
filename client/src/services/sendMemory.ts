import { ENDPOINT } from "../constants"
import { SEND_MEMORY } from "../queries"
import { returnMemory } from "./memory"

/**
 * Function that sends the client's current memory status to the server with the given IP address.
 */
export function sendMemory(ip = ENDPOINT): Promise<boolean> {
  const memoryStatus = returnMemory()
  if (memoryStatus instanceof Error) {
    console.error(memoryStatus)
    return new Promise(() => false)
  }

  return fetch(ip, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: SEND_MEMORY,
      variables: { log: memoryStatus },
    }),
  })
    .then(res => res.ok)
    .catch(error => {
      console.error({ error })
      return false
    })
}

sendMemory.description = `Function that sends the client's current memory status to the server with the given IP address.`

Object.assign(window, {sendMemoryToServer: sendMemory})