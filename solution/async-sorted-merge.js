'use strict';

var MinHeap = require('./minheap');

module.exports = (logSources, printer) => {
	var minheap = new MinHeap();
	let i = 0;
	Promise.all(logSources.map(logSource => {
		return logSource.popAsync().then(log => {
			minheap.insert({
				ts: log.date.getTime(),
				source: i++,
				data: log
			})
		});
	})).then(() => {
		return whileHeapList(minheap, printer, logSources);
	}).then(() => {
		printer.done();
	});
};

const whileCurrTimestampLTENextMinTimestamp = (minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode) => {
	if (currTimestamp <= nextMinTimestamp) {
		return logSources[heapNode['source']].popAsync().then(log => {
			if (log) {
				let logtime = log.date.getTime();
				if (logtime <= nextMinTimestamp) {
					printer.print(log);
					currTimestamp = logtime;
					// continue looping
					return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode);
				} else {
					minheap.insert({
						ts: logtime,
						source: heapNode["source"],
						data: log
					});
					// ensure promise returns and 'break' out of loop
					// return Promise.resolve();
				}
			} else {
				console.log('Drained: ' + heapNode['source']);
				heapNode = minheap.popMin();
				printer.print(heapNode.data);
				currTimestamp = heapNode['ts'];
				if (minheap.heapList.length) {
					nextMinTimestamp = minheap.getPeakTimestamp();
					// continue looping
					return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode);
				} else {
					return whileTrue(printer, logSources, heapNode)
				}
			}
		});
	} else {
		// make sure to return Promise!
		return Promise.resolve()
	}
};

const whileTrue = (printer, logSources, heapNode) => {
	return logSources[heapNode['source']].popAsync().then(m => {
		if (m) {
			printer.print(m);
			return whileTrue(printer, logSources, heapNode);
		} else {
			console.log('Drained: ' + heapNode['source']);
			// Promise resolved by itself. No need for resolve().
		}
	});
};

const whileHeapList = (minheap, printer, logSources) => {
	if (minheap.heapList.length) {
		let heapNode = minheap.popMin();
		let currTimestamp = heapNode['ts'];
		printer.print(heapNode.data);
		let nextMinTimestamp = minheap.getPeakTimestamp();
		return whileCurrTimestampLTENextMinTimestamp(minheap, printer, logSources, currTimestamp, nextMinTimestamp, heapNode).then(() => {
			whileHeapList(minheap, printer, logSources);
		});
	} else {
		// necessary to ensure that the final results is always a Promise
		return Promise.resolve();
	}
};



//v2
// const whileHeapList = () => {
// 	return new Promise(resolve => {
// 		if (minheap.heapList.length) {
// 			let heapNode = minheap.popMin();
// 			let currTimestamp = heapNode['ts'];
// 			printer.print(heapNode.data);
// 			let nextMinTimestamp = minheap.getPeakTimestamp();
// 			const whileCurrTimestampLTENextMinTimestamp = () => {
// 				if (currTimestamp <= nextMinTimestamp) {
// 					return logSources[heapNode['source']].popAsync().then(log => {
// 						if (log) {
// 							let logtime = log.date.getTime();
// 							if (logtime <= nextMinTimestamp) {
// 								printer.print(log);
// 								currTimestamp = logtime;
// 							} else {
// 								minheap.insert({ts: logtime, source: heapNode["source"], data: log});
// 							}
// 						} else {
// 							console.log('Drained: ' + heapNode['source']);
// 							heapNode = minheap.popMin();
// 							printer.print(heapNode.data);
// 							currTimestamp = heapNode['ts'];
// 							if (minheap.heapList.length) {
// 								nextMinTimestamp = minheap.getPeakTimestamp();
// 							} else {
// 								const whileTrue = () => {
// 									return logSources[heapNode['source']].popAsync().then(m => {
// 										if (m) {
// 											printer.print(m);
// 										} else {
// 											console.log('Drained: ' + heapNode['source']);
// 										}
// 									});
// 								};
// 								return whileTrue();
// 							}
// 						}
// 					}).then(whileCurrTimestampLTENextMinTimestamp);
// 				}
// 			};
// 			// first iteration of whileCurrTimestampLTENextMinTimestamp
// 			return whileCurrTimestampLTENextMinTimestamp().then(whileHeapList);
// 		}
// 	});
// };
// return whileHeapList();


// v1
// () => {
// 	const whileHeapList = () => {
// 		return new Promise(resolve => {
// 			if (minheap.heapList.length) {
// 				let heapNode = minheap.popMin();
// 				let currTimestamp = heapNode['ts'];
// 				printer.print(heapNode.data);
// 				let nextMinTimestamp = minheap.getPeakTimestamp();
// 				const whileCurrTimestampLTENextMinTimestamp = () => {
// 					// return new Promise(resolve => {
// 					if (currTimestamp <= nextMinTimestamp) {
// 						return logSources[heapNode['source']].popAsync().then(log => {
// 							if (log) {
// 								let logtime = log.date.getTime();
// 								if (logtime <= nextMinTimestamp) {
//
// 									printer.print(log);
// 									currTimestamp = logtime;
// 								} else {
// 									minheap.insert({ts: logtime, source: heapNode["source"], data: log});
// 									resolve();
// 								}
// 							} else {
// 								// console.log('Drained: ' + heapNode['source']);
// 								heapNode = minheap.popMin();
// 								printer.print(heapNode.data);
// 								currTimestamp = heapNode['ts'];
// 								if (minheap.heapList.length) {
// 									nextMinTimestamp = minheap.getPeakTimestamp();
// 								} else {
// 									const whileTrue = () => {
// 										return logSources[heapNode['source']].popAsync().then(m => {
// 											if (m) {
// 												printer.print(m);
// 											} else {
// 												console.log('Drained: ' + heapNode['source']);
// 												// resolve();
// 											}
// 										});
// 									};
// 									return whileTrue();
// 								}
// 							}
// 						}).then(() => {
// 							// continue iteration
// 							// return whileCurrTimestampLTENextMinTimestamp();
// 							whileCurrTimestampLTENextMinTimestamp();
// 						});
//
// 					}
// 					// else {
// 					// 	// Done with whileCurrTimestampLTENextMinTimestamp
// 					// 	resolve();
// 					// }
// 					// })
// 				};
// 				// first iteration of whileCurrTimestampLTENextMinTimestamp
// 				return whileCurrTimestampLTENextMinTimestamp().then(() => {
// 					// continue whileHeapList loop
// 					// return whileHeapList();
// 					whileHeapList();
// 				});
// 			}
// 			// else {
// 			// 	console.log('resolve');
// 			// 	resolve()
// 			// }
// 		});
// 	};
// 	return whileHeapList();
// }