const Promise = require('bluebird')
const MinHeap = require('./minheap')

const whileTrue = (printer, logSources, heapNode) => logSources[heapNode.source].popAsync()
  .then((m) => {
    if (m) {
      printer.print(m)
      return whileTrue(printer, logSources, heapNode)
    }
    return console.info(`Drained: ${heapNode.source}`)
  })

const whileCurrTimestampLTENextMinTimestamp = (minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode) => {
  if (currTimestamp <= nextMinTimestamp) {
    return logSources[heapNode.source].popAsync()
      .then((log) => {
        if (log) {
          const logtime = log.date.getTime()
          if (logtime <= nextMinTimestamp) {
            printer.print(log)
            currTimestamp = logtime
            // continue looping
            return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode)
          }
          return minheap.insert({
            ts: logtime,
            source: heapNode.source,
            data: log,
          })
        }
        console.info(`Drained: ${heapNode.source}`)
        heapNode = minheap.popMin()
        printer.print(heapNode.data)
        currTimestamp = heapNode.ts
        if (minheap.heapList.length) {
          nextMinTimestamp = minheap.getPeakTimestamp()
          // continue looping
          return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode)
        }

        return whileTrue(printer, logSources, heapNode)
      })
  }

  return 'All done!'
}

const whileHeapList = (minheap, printer, logSources) => {
  if (!minheap.heapList.length) return 'All done'

  const heapNode = minheap.popMin()
  const currTimestamp = heapNode.ts
  printer.print(heapNode.data)
  const nextMinTimestamp = minheap.getPeakTimestamp()
  return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode)
    .then(() => whileHeapList(minheap, printer, logSources))
}

module.exports = (logSources, printer) => {
  const minheap = new MinHeap()
  let i = 0
  Promise.map(logSources, logSource => logSource.popAsync())
    .map(log => minheap.insert({ ts: log.date.getTime(), source: i++, data: log }))
    .then(() => whileHeapList(minheap, printer, logSources))
    .then(() => printer.done())
}
