export type TUnknownObject = Record<string, unknown>
export type TRecordOfNumbers = Record<string, number>
export type TRecordOfStringOrNumbers = Record<string, string | number>

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
  location = 'location',
  divergence = 'divergence',
}

export type TMemoryStatus = {
  clientTimestamp: string
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
  location: string
  divergence?: {
    jsHeapSizeLimit: string
    totalJSHeapSize: string
    usedJSHeapSize: string
  }
}

export type TMemoryStatusReduced = {
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
}

export type TMemoryAverage = {
  number: number
  jsHeapSizeLimit: string
  totalJSHeapSize: string
  usedJSHeapSize: string
}
