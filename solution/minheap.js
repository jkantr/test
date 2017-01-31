

class MinHeap {
    // at node p
    // left child is at 2p + 1
    // right child is at 2p + 2
    // node at c
    // parent is at (c - 1)/2
    constructor() {
        // this.currentSize = 0;
        this.heapList = [];
    }

    getPeakTimestamp() {
        return this.heapList[0]['ts'];
    }

    getParentIndex(childIndex) {
        return childIndex > 0 ? Math.floor((childIndex - 1) / 2) : 0
    }

    insert(node) {
        // debugger;
        // this.currentSize += 1;
        this.heapList.push(node);
        let childIndex = this.heapList.length - 1;
        let parentIndex = this.getParentIndex(childIndex);
        while (parentIndex >= 0 && this.heapList[parentIndex]["ts"] > this.heapList[childIndex]["ts"]) {
            let tmp = this.heapList[parentIndex];
            this.heapList[parentIndex] = this.heapList[childIndex];
            this.heapList[childIndex] = tmp;
            childIndex = parentIndex;
            parentIndex = this.getParentIndex(childIndex);
        }
    }

    popMin() {
        if (this.heapList.length > 0) {
            const heapPeak = this.heapList[0];
            let parentIndex = 0;
            // After removing node, reorganize Heap
            if (this.heapList.length === 1) {
                return this.heapList.pop();
            }

            this.heapList[0] = this.heapList.pop();
            while (true) {
                let leftIndex = (2 * parentIndex) + 1;
                let rightIndex = leftIndex + 1;
                if (leftIndex > this.heapList.length - 1) {
                    break;
                } else {
                    let leftChildTimestamp = this.heapList[leftIndex]['ts'];
                    let rightChildTimestamp = rightIndex < this.heapList.length ? this.heapList[rightIndex]['ts'] : Number.MAX_SAFE_INTEGER;
                    let minChildIndex = null;
                    if (leftChildTimestamp < rightChildTimestamp) {
                        minChildIndex = leftIndex;
                    } else {
                        minChildIndex = rightIndex;
                    }
                    if (this.heapList[parentIndex]['ts'] > this.heapList[minChildIndex]['ts']) {
                        let tmp = this.heapList[parentIndex];
                        this.heapList[parentIndex] = this.heapList[minChildIndex];
                        this.heapList[minChildIndex] = tmp;
                        parentIndex = minChildIndex;
                    } else {
                        break;
                    }
                }
            }
            return heapPeak;
        }
    }
}

module.exports = MinHeap;