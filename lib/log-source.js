'use strict';

const _ = require('lodash');
const Faker = require('Faker');
const P = require('bluebird');

// const repl = require('repl');

// Although we tend to despise OOP, most real world implementations of something like a log source
// will still be in OO form, so we'll simulate that same real world interaction for now.

module.exports = class LogSource {
	constructor() {
		this.drained = false;
		this.last = {
			date: new Date(Date.now() - (1000 * 60 * 60 * 24 * _.random(40, 60))),
			msg: Faker.Company.catchPhrase()
		};
	}

	getNextPseudoRandomEntry() {
		return {
			date: new Date(this.last.date.getTime() + (1000 * 60 * 60 * _.random(10)) + _.random(1000* 60)),
			msg: Faker.Company.catchPhrase()
		};
	}

	pop() {
		// debugger;
		this.last = this.getNextPseudoRandomEntry();
		if (this.last.date > new Date()) {
			this.drained = true;
		}
		return this.drained ? false : this.last;
	}

	popAsync() {
		this.last = this.getNextPseudoRandomEntry();
		if (this.last.date > Date.now()) {
			this.drained = true;
		}
		return P.delay(_.random(8)).then(() => this.drained ? false : this.last);
	}
};