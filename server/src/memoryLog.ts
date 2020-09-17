import fs from 'fs'
import { TMemoryLog } from './types'


const rawLogs = fs.readFileSync('./data/memoryLog.json')

export const memoryLog: TMemoryLog = JSON.parse((rawLogs as unknown) as string)
