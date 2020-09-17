export type TMemoryStatus = {
    clientTimestamp: string
    jsHeapSizeLimit: string
    totalJSHeapSize: string
    usedJSHeapSize: string
    location: string
  }
  
  export type TMessage = {
    from: string
    to: string[]
    subject: string
    text?: string
    html?: string
  }