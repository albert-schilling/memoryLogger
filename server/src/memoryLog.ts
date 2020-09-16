import fs from 'fs'

export type TMemoryLog = {
  logs?: [TMemoryLogSession]
  average?: TMemoryAverage
}

export type TMemoryLogSession = {
  start: string
  sessionLogs: [TMemoryStatus]
  end?: string
  average: TMemoryAverage
  growth?: string
}

export enum PROPERTIES {
  clientTimestamp = 'clientTimestamp',
  jsHeapSizeLimit = 'jsHeapSizeLimit',
  totalJSHeapSize = 'totalJSHeapSize',
  usedJSHeapSize = 'usedJSHeapSize',
  divergence = 'divergence'
}

export type TMemoryStatus = {
  clientTimestamp: string
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
  divergence?: {
    clientTimestamp: string
    jsHeapSizeLimit: string
    totalJSHeapSize: string
    usedJSHeapSize: string
  }
}

export type TMemoryAverage = {
  number: number
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
}

const rawLogs = fs.readFileSync('./data/memoryLog.json')

export const memoryLog: TMemoryLog = JSON.parse((rawLogs as unknown) as string)
