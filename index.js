'use strict';

const LogSource = require('./lib/log-source');
const Printer = require('./lib/printer');

// You can adjust this variable to see how your solutions perform under various "load"
// const sourceCount = 100;

const sourceCount = 4;

/**
 * Challenge Number 1!
 * 
 * Assume that a LogSource only has one method: pop() which will return a LogEntry.
 * 
 * A LogEntry is simply an object of the form:
 * {
 * 		date: Date,
 * 		msg: String,
 * }
 *
 * All LogEntries from a given LogSource are guaranteed to be popped in chronological order.
 * Eventually a LogSource will end and return boolean false.
 * 
 * Your job is simple: print the sorted merge of all LogEntries across `n` LogSources.
 *
 * Call `printer.print(logEntry)` to print each entry of the merged output as they are ready.
 * This function will ensure that what you print is in fact in chronological order.
 * Call 'printer.done()' at the end to get a few stats on your solution!
 */

/*const syncLogSources = Array.from(Array(sourceCount)).map(count => new LogSource());

require('./solution/sync-sorted-merge')(syncLogSources, new Printer());*/

/**
 * Challenge Number 2!
 *
 * Very similar to Challenge Number 1, except now you should assume that a LogSource
 * has only one method: popAsync() which returns a promise that resolves with a LogEntry,
 * or boolean false once the LogSource has ended.
 */

const asyncLogSources = Array.from(new Array(sourceCount)).map(count => new LogSource());

require('./solution/async-sorted-merge')(asyncLogSources, new Printer());

