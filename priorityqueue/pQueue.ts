//default property class
class Property{
    address: string;
    price: number;
    land_value: number;
    land_size: number;
    sale_value: number;


    constructor(add: string, p: number, l_val: number, l_s: number, s_v: number) {
        this.address = add;
        this.price = p;
        this.land_value = l_val;
        this.land_size = l_s;
        this.sale_value = s_v;
    }
}

//generic class, holds any type (ex: X)
class PriorityQueue<X> {
    //internal array
    private heap: X[]; 
  
    //will determine the ordering
    // >0 if higher than b, <0 if lower than b, =0 if equal priority
    private comparator: (a: X, b: X) => number;

    constructor(comparator: (a: X, b: X) => number) {
        this.heap=[];
        this.comparator=comparator;
    }

    //
    //HEAP NAVIGATION METHODS
    private parent(index: number) : number {
        return Math.floor((index-1)/2);
    }
    private left(index: number) : number {
        return 2*index+1;
    }
    private right(index: number): number {
        return 2*index+2;
    }
    private swap(i: number, j: number): void { //to swap two elements in a heap
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    //
    //HEAP MAINTANANCE METHODS
    private heapify_up(index: number): void { //move up until property restored, call after insert
        while(index>0 && this.comparator(this.heap[index], this.heap[this.parent(index)]) < 0) {
            this.swap(index, this.parent(index));
            index = this.parent(index);
        }
    }
    private heapify_down(index: number): void { //move down until restored, call after extraction
        let smallest = index;
        const left = this.left(index);
        const right = this.right(index);
        if(left < this.heap.length && this.comparator(this.heap[left],this.heap[smallest]) < 0) {
            smallest = left;
        }
        if(right < this.heap.length && this.comparator(this.heap[right],this.heap[smallest]) < 0) {
            smallest = right; //same two ifs
        }
        if(smallest !== index) {
            this.swap(index, smallest);
            this.heapify_down(smallest);
        }
    }

    //
    //CORE QUEUE OPS
    insert(value: X): void { //insert new item into queue
        this.heap.push(value);
        this.heapify_up(this.heap.length-1);
    } //Time Complexity: WIP
    extractMinimum(): X | undefined { //get rid of highest priority element
        if(this.heap.length === 0) {
            return undefined;
        }
        if(this.heap.length === 1) {
            return this.heap.pop();
        }
        const top = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapify_down(0);
        return top;
    } //Time Complexity: WIP
    peek(): X | undefined { //just return the highest priority
        return this.heap[0];
    } //Time Copmlexity: WIP
    isEmpty(): boolean { //if the queue is empty, true
        if(this.heap.length ===0) {
            return true;
        }
        return false;
    }
    size(): number { //return how many elements are in queue
        return this.heap.length;
    }
    filter(predicate: (item: X) => boolean) : X[] { //return all elements to satisfy predicate
        return this.heap.filter(predicate);
    } //NON-modifier


    //quick debugger method
    printQueue(): void {
        console.log(this.heap);
    }
}
