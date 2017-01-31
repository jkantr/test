'use strict';

var MinHeap = require('./minheap');

module.exports = (logSources, printer) => {
	const lenLogSources = logSources.length;
	let minheap = new MinHeap();
	// Because each log source is in chronological order, lets .pop() the starting
	// point of each log source and push it onto the heap
	for (let i = 0; i < lenLogSources; i++) {
		let log = logSources[i].pop();
		minheap.insert({
			ts: log.date.getTime(),
			source: i,
			data: log
		})
	}
	while (minheap.heapList.length) {
		let heapNode = minheap.popMin();
		let currTimestamp = heapNode['ts'];
		printer.print(heapNode.data);
		let nextMinTimestamp = minheap.getPeakTimestamp();
		while (currTimestamp <= nextMinTimestamp) {
			// .pop() next log
			let log = logSources[heapNode['source']].pop();
			if (log) {
				let logtime = log.date.getTime();
				if (logtime <= nextMinTimestamp) {
					printer.print(log);
					currTimestamp = logtime;
				} else {
					/*
					 - Save where we left off
					 - At this point the log inserted back into the minheap has a timestamp greater than the
					 beginning of another log source
					 */
					minheap.insert({
						ts: logtime,
						source: heapNode["source"],
						data: log
					});

					break;
				}
			} else {
				console.log('Drained: ' + heapNode['source']);
				heapNode = minheap.popMin();
				printer.print(heapNode.data);
				currTimestamp = heapNode['ts'];
				if (minheap.heapList.length) {
					nextMinTimestamp = minheap.getPeakTimestamp();
				} else {
					// Last node, continue to .pop() until finished
					while (true) {
						let m = logSources[heapNode['source']].pop();
						if (m) {
							printer.print(m);
						} else {
							console.log('Drained: ' + heapNode['source']);
							break;
						}
					}
					break;
				}
			}
		}
	}
	printer.done();
};