import test from 'ava'
import LogSource from './log-source'

test('should synchronously drain a log source', t => {
	const source = new LogSource();
	let entry = source.pop();
	t.true(new Date() > entry.date);
	t.truthy(entry.msg);
	entry = source.pop();
	t.true(new Date() > entry.date);
	t.truthy(entry.msg);
	source.last.date = new Date();
	entry = source.pop();
	t.false(entry)
});

test('should asynchronously drain a log source', async t => {
	const source = new LogSource();
	let entry = await source.popAsync();
	t.true(new Date() > entry.date);
	t.truthy(entry.msg);
	entry = await source.popAsync();
	t.true(new Date() > entry.date);
	t.truthy(entry.msg);
	source.last.date = new Date();
	entry = await source.popAsync();
	t.false(entry);
});