import * as fs from 'fs';
import { parse } from 'csv-parse';

//TODO: Finish Comments

export class Property{

    //Properties of each Node
    address: string;
    price: number = 0;
    land_value: number = 0;
    land_size: number = 0;
    sale_value: number = 0;

    constructor(add: string, p: number, l_val: number, l_s: number, s_v: number) {
        this.address = add;
        this.price = p;
        this.land_value = l_val;
        this.land_size = l_s;
        this.sale_value = s_v;
    }
}

class B_Plus_Tree_Node{

    keys: Property[] = [];
    children: B_Plus_Tree_Node[] = [];
    // @ts-ignore
    next: B_Plus_Tree_Node = null;

    //Bool value on whether we have a leaf or node
    leaf: boolean = false;

    constructor(isLeaf: boolean);
    constructor();

    constructor(isLeaf?: boolean) {
        if(isLeaf !== undefined){
            this.leaf = isLeaf;
        }
    }

}

export class B_Plus_Tree {

    // @ts-ignore
    private root: B_Plus_Tree_Node = null;
    private price_average: bigint = BigInt(0);
    private land_average: bigint = BigInt(0);
    private Order: number = 0;

    constructor(order: number) {
        this.Order = order;
    }

    //All of these methods contribute to Inserting in the B+ Tree
    private upper_bound(arr: Property[], value: Property): number {
        let low = 0;
        let high = arr.length;
        let result = arr.length; // Default to arr.length if no element is found

        const comparator = (a: Property, b: Property): number => {
            // Compare the 'price' property of the two objects
            if (a.price < b.price) return -1;
            if (a.price > b.price) return 1;
            return 0;
        };

        while (low < high) {
            const mid = Math.floor(low + (high - low) / 2);
            if (comparator(arr[mid], value) > 0) {
                result = mid;
                high = mid;
            } else { // arr[mid] <= value
                low = mid + 1;
            }
        }
        return result; // Returns the index of the first element strictly greater than 'value'
    }
    private splitChild(parent: B_Plus_Tree_Node, index: number, child: B_Plus_Tree_Node): void {
        let newChild: B_Plus_Tree_Node = new B_Plus_Tree_Node(child.leaf);

        parent.children.splice(index + 1, 0, newChild);

        parent.keys.splice(index, 0, child.keys[this.Order - 1]);
        newChild.keys = child.keys.slice(this.Order);
        child.keys.length = this.Order - 1;

        if (!child.leaf) {
            newChild.children = child.children.slice(this.Order);
            child.children.length = this.Order;
        }

        if (child.leaf) {
            newChild.next = child.next;
            child.next = newChild;
        }
    }
    private insertNonFull(node: B_Plus_Tree_Node, key: Property): void {
        if (node.leaf) {
            let index: number = this.upper_bound(node.keys, key);
            node.keys.splice(index, 0, key);
        } else {
            let i: number = node.keys.length - 1;
            while (i >= 0 && key.price < node.keys[i].price) {
                i--;
            }
            i++;
            if (node.children[i].keys.length == 2 * this.Order - 1) {
                this.splitChild(node, i, node.children[i]);
                if (key.price > node.keys[i].price) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }
    insert(key: Property): void {
        if (this.root == null) {
            this.root = new B_Plus_Tree_Node(true);
            this.root.keys.push(key);
        } else {
            if (this.root.keys.length == 2 * this.Order - 1) {
                let newRoot: B_Plus_Tree_Node = new B_Plus_Tree_Node();
                newRoot.children.push(this.root);
                this.splitChild(newRoot, 0, this.root);
                this.root = newRoot;
            }
            this.insertNonFull(this.root, key);
        }
    }

    //These Methods Contribute to printing the tree
    private printTreeHelper(node: B_Plus_Tree_Node, level: number): void {
        if (node != null) {

            let outputLine = "";
            for (let i: number = 0; i < level; ++i) {
                outputLine += " ";
            }
            for (const key of node.keys) {
                outputLine += key.price + " ";
            }
            console.log(outputLine);
            for (let child of node.children) {
                this.printTreeHelper(child, level + 1);
            }
        }
    }
    printTree(): void {
        this.printTreeHelper(this.root, 0);
    }

    // Perform Filter Operations
    private search_by_price(key: number): Property[] {
        let result: Property[] = [];
        let current: B_Plus_Tree_Node | null = this.root;

        if (current !== null && !current.leaf) {
            for (const data of current.keys) {
                if (data.price > key) {
                    result.push(data);
                }
            }
        }

        while (current !== null && !current.leaf) {
            let i: number = 0;
            while (i < current.keys.length && key >= current.keys[i].price) {
                i++;
            }
            current = current.children[i] || null;
        }

        if (current === null) {
            return result;
        }

        let leaf: B_Plus_Tree_Node | null = current;

        for (const data of leaf.keys) {
            if (data.price >= key) {
                result.push(data);
            }
        }

        while (leaf?.next !== null && leaf?.next !== undefined) {
            leaf = leaf.next;

            for (const data of leaf.keys) {
                result.push(data);
            }
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
    filter(min_price: number, min_size: number): Property[] {

        let result: Property[] =  this.search_by_price(min_price);
        result = this.search_by_land_size(result, min_size);
        return result;
    }

    get_price_average(): bigint{
        return this.price_average;
    } 

    get_land_average(): bigint{
        return this.land_average;
    } 

}


let hi: B_Plus_Tree = new B_Plus_Tree(10000);

interface AssessorRecord {
    PHY_ADDR1: string;
    LND_SQFOOT: number;
    LND_VAL: number;
    AV_NSD: number;
    JV: number;
}
