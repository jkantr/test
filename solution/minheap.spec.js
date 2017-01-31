var test = require('ava');
var MinHeap  = require('./minheap');

const tests = [
    // empty
    [[],[]],
    // regular mixed up array
    [[{ts: 1}, {ts: 4}, {ts: 8}, {ts: 3}, {ts: 10}, {ts: 12}, {ts: 6}, {ts: 17}],
        [{ts: 1}, {ts: 3}, {ts: 6}, {ts: 4}, {ts: 10}, {ts: 12}, {ts: 8}, {ts: 17}]],
    // min heap
    [[{ts: 1}, {ts: 4}, {ts: 3}, {ts: 5}, {ts: 6}, {ts: 10}, {ts: 14}, {ts: 9}],
        [{ts: 1}, {ts: 4}, {ts: 3}, {ts: 5}, {ts: 6}, {ts: 10}, {ts: 14}, {ts: 9}]]
];

const poptests = [
    // empty
    [[],[]],
    // regular mixed up array
    [[{ts: 1}, {ts: 4}, {ts: 8}, {ts: 3}, {ts: 10}, {ts: 12}, {ts: 6}, {ts: 17}],
        // number of pops
        2,
        [{ts: 4}, {ts: 8}, {ts: 6}, {ts: 17}, {ts: 10}, {ts: 12}]],
    // min heap
    [[{ts: 1}, {ts: 4}, {ts: 3}, {ts: 5}, {ts: 6}, {ts: 10}, {ts: 14}, {ts: 9}],
        // number of pops
        3,
        [{ts: 5}, {ts: 6}, {ts: 9}, {ts: 14}, {ts: 10}]]
];

function validateMinHeap(testcase) {
    debugger;
    let minHeap = new MinHeap();
    for (let i = 0; i < testcase.length; i++) {
        minHeap.insert(testcase[i]);
    }
    return minHeap.heapList;
}

test('Empty case', t => {
    let ts = tests[0][0];
    let r = tests[0][1];
    t.deepEqual(validateMinHeap(ts),r);
});

test('Mixed array', t => {
    let ts = tests[1][0];
    let r = tests[1][1];
    t.deepEqual(validateMinHeap(ts),r);
});

test('min heap', t => {
    let ts = tests[2][0];
    let r = tests[2][1];
    t.deepEqual(validateMinHeap(ts),r, "test");
});

// test('popping minimum, empty', t => {
//     let ts = poptests[0][0];
//     t.deepEqual()
// });

test('popping minimum, mixed array', t => {
    let ts = poptests[1][0];
    let pops = poptests[1][1];
    let r = poptests[1][2];
    let minheap = new MinHeap();
    for (let i = 0; i < ts.length; i++) {
        minheap.insert(ts[i]);
    }
    for (let i = 0; i < pops; i++) {
        minheap.popMin();
    }
    t.deepEqual(minheap.heapList, r);
});

test('popping minimum, min heap', t => {
    let ts = poptests[2][0];
    let pops = poptests[2][1];
    let r = poptests[2][2];
    let minheap = new MinHeap();
    for (let i = 0; i < ts.length; i++) {
        minheap.insert(ts[i]);
    }
    for (let i = 0; i < pops; i++) {
        minheap.popMin();
    }

    t.deepEqual(minheap.heapList, r);
});