import { TMemoryStatus, TMemoryAverage } from "../memoryLog";

/**
 * Function that returns a string containing HTML for a memory leakage warning email containing information about the client's memory useage: used memory growth, set growth limit and current memory status.
 */
export function memoryLeakageWarningHTML({clientTimestamp,jsHeapSizeLimit,totalJSHeapSize, usedJSHeapSize, growth, limit}: TMemoryStatus & {growth: number, limit: number}): string {
    return `<h2>Memory Documentation</h2>
    <h3>Memory Leakage Warning<h3>
    <p>The memory usage shows a significant growth rate of ${growth} that surpasses the defined growth limit of ${limit}. Memory leakage is quite probable.</p>

    <h4>Current session info</h4>
    <p>Memory growth (usedJSHeapSize): ${growth}</p>
    <p>Set limit for memory growth: ${limit}</p>
  
    <h4>Current memory log info:</h4>
    <p>client timestamp: ${clientTimestamp}</p>
    <p>client date: ${new Date(Number(clientTimestamp)).toDateString()} ${new Date(
      Number(clientTimestamp)
      ).toTimeString()}</p>
    <p>JS Heap Size Limit: ${jsHeapSizeLimit}</p>
    <p>total JS Heap Size: ${totalJSHeapSize}</p>
    <p>used JS Heap Size: ${usedJSHeapSize}</p>
    `
}

/**
 * Function that returns a string containing HTML for a daily report email containing information about the client's memory useage: current used memory growth, set growth limit, session average and last memory status.
 */
export function dailyReportHTML({clientTimestamp,jsHeapSizeLimit,totalJSHeapSize, usedJSHeapSize, growth, limit, average}: TMemoryStatus & {growth: number, limit: number, average: TMemoryAverage}): string {
  return `<h2>Memory Documentation</h2>
  <h3>Daily Report<h3>

  <h4>Current session info</h4>
  <p>Memory growth (usedJSHeapSize): ${growth}</p>
  <p>Set limit for memory growth: ${limit}</p>

  <h4>Average</h4>
  <p>Number of logs: ${average.number}</p>
  <p>Average JS Heap Size Limit: ${average.jsHeapSizeLimit}</p>
  <p>Average total JS Heap Size: ${average.totalJSHeapSize}</p>
  <p>Average used JS Heap Size: ${average.usedJSHeapSize}</p>

  <h4>Last memory log info:</h4>
  <p>client timestamp: ${clientTimestamp}</p>
  <p>client date: ${new Date(Number(clientTimestamp)).toDateString()} ${new Date(
    Number(clientTimestamp)
    ).toTimeString()}</p>
  <p>JS Heap Size Limit: ${jsHeapSizeLimit}</p>
  <p>total JS Heap Size: ${totalJSHeapSize}</p>
  <p>used JS Heap Size: ${usedJSHeapSize}</p>
  `
}