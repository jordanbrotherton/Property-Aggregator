import { Property } from './property';

//generic class, holds any type (ex: X)
export class MaxHeap{

    //Attributes for Averages
    private price_average: bigint = BigInt(0);
    private land_average: bigint = BigInt(0);

    //internal arrays; One is the actual array. The other is for filters to modify
    private stored_heap: Property[] = [];
    private heap: Property[] = [];

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

    //Different swaps depending on heap in use
    private swap_heap(i: number, j: number): void { //to swap two elements in a heap
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    private swap_stored_heap(i: number, j: number): void { //to swap two elements in a heap
        [this.stored_heap[i], this.stored_heap[j]] = [this.stored_heap[j], this.stored_heap[i]];
    }


    //
    //HEAP MAINTANANCE METHODS
    //Each heap operates on a different array so that filter can run optimally
    private heapify_up() {
        let index = this.stored_heap.length - 1;
        while (this.parent(index) >= 0 && this.stored_heap[this.parent(index)].price < this.stored_heap[index].price) {
            this.swap_stored_heap(this.parent(index), index);
            index = this.parent(index);
        }
    }
    private heapify_down() {
        let index = 0;
        let n = this.heap.length;

        while (this.left(index) < n) {
            let largest = index;
            let leftIndex = this.left(index);
            let rightIndex = this.right(index);

            // 1. Check if left child is larger than current largest (parent)
            if (leftIndex < n && this.heap[leftIndex].price > this.heap[largest].price) {
                largest = leftIndex;
            }

            // 2. Check if right child is larger than current largest (either parent or left child)
            if (rightIndex < n && this.heap[rightIndex].price > this.heap[largest].price) {
                largest = rightIndex;
            }

            // 3. If the largest element is not the current element, swap and continue.
            if (largest !== index) {
                this.swap_heap(index, largest);
                index = largest; // Continue down the tree
            } else {
                break; // Max-Heap property is satisfied at this node
            }
        }
    }

    //
    //CORE QUEUE OPS
    insert(value: Property): void { //insert new item into queue
        this.stored_heap.push(value);
        this.heapify_up();
    }

    //Time Complexity: WIP
    //Only works on our array to manipulate
    extractMaximum(): Property | undefined { //get rid of highest priority element
        if(this.heap.length === 0) {
            return undefined;
        }
        if(this.heap.length === 1) {
            return this.heap.pop();
        }
        const top = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapify_down();
        return top;
    }

    //Time Complexity: WIP
    //Peeks our actual heap
    peek(): Property | undefined { //just return the highest priority
        if (this.stored_heap.length === 0) {
            return undefined;
        }
        return this.stored_heap[0];
    }

    //Peeks the heap that we manipulate
    private peek_heap_internal(): Property | undefined { //just return the highest priority
        if (this.heap.length === 0) {
            return undefined;
        }
        return this.heap[0];
    }

    //Time Copmlexity: WIP
    isEmpty(): boolean { //if the queue is empty, true
        if(this.stored_heap.length ===0) {
            return true;
        }
        return false;
    }

    //quick debugger method
    printHeap(): void {
        for(let i = 0; i<this.stored_heap.length;i++) {
            console.log(this.stored_heap[i]);
        }
    }


    private search_by_price(key: number): Property[] {
        let result: Property[] = [];
        while (this.heap.length > 0) {
            const top = this.peek_heap_internal();

            if (!top || top.price <= key) {
                break;
            }
            result.push(this.extractMaximum()!);
        }
        result.sort((a, b) => a.price - b.price);
        return result;
    }

    private search_by_land_size(key: Property[], size: number): Property[] {

        //Array to Hold Result From Filter
        let result: Property[] = [];
        let price: bigint = BigInt(0);
        let land: bigint = BigInt(0);

        //Looping Through Array to Find All greater Land Sizes
        for (const data of key) {
            if(data.land_size >= size){
                result.push(data);
                if(!isNaN(data.price))
                    price += BigInt(data.price);
                if(!isNaN(data.land_size))
                    land += BigInt(data.land_size);
            }
        }
        if(result.length != 0){
            this.price_average = price / BigInt(result.length);
            this.land_average = land / BigInt(result.length);
        }else{
            this.price_average = BigInt(0);
            this.land_average = BigInt(0);
        }

        return result;
    }
    private remove_unassigned(key: Property[], remove: boolean): Property[] {

        let result: Property[] = [];
        let price: bigint = BigInt(0);
        let land: bigint = BigInt(0);

        if(remove){
        for (const data of key) {
            if(data.address != "UNASSIGNED LOCATION RE"){
                result.push(data);
                    if(!isNaN(data.price))
                    price += BigInt(data.price);
                    if(!isNaN(data.land_size))
                    land += BigInt(data.land_size);
            }
        }
    }else{
        return key;
    }

       if(result.length != 0){
            this.price_average = price / BigInt(result.length);
            this.land_average = land / BigInt(result.length);
        }else{
            this.price_average = BigInt(0);
            this.land_average = BigInt(0);
        }

        return result;
    }

    filter(min_price: number, min_size: number, remove: boolean): Property[] {
        this.heap = [...this.stored_heap];
        let result: Property[] =  this.search_by_price(min_price);
        result = this.search_by_land_size(result, min_size);
        result = this.remove_unassigned(result, remove);
        return result;
    }

    get_price_average(): bigint{
        return this.price_average;
    } 

    get_land_average(): bigint{
        return this.land_average;
    } 
}
