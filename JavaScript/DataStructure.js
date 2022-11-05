


class Stack{
    constructor(){  this.array = []; }
    push(element){ this.array.push(element); }
    pop(){ this.array.pop(); }
    top(){ return this.array.length ? this.array[this.array.length - 1] : null; }
    size(){ return this.array.length; }
    empty(){ return this.array.length ? false : true; }
    clear(){ this.array = []; }
}

class Queue{
    constructor(){ this.array = []; }
    push(element){ this.array.push(element); }
    pop(){ this.array.shift(); }
    front(){ return this.array.length ? this.array[0] : null; }
    size(){ return this.array.length; }
    empty(){ return this.array.length ? false : true; }
    clear(){ this.array = []; }
}

class PriorityQueue{
    constructor(cmp = (a, b) => a < b){
        this.heap = [];
        this.compare = cmp;
    }
    setCompare(cmp){ this.compare = cmp; }
    swap(i, j){
        let temp = this.heap[i]; 
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }
    size(){ return this.heap.length; }
    empty(){ return this.heap.length ? false : true; }
    clear(){ return this.heap = []; }
    leftChild(i){ return (i << 1) + 1; }
    rightChild(i){ return (i << 1) + 2; }
    parent(i){ return (i >> 1) - (i & 1 ^ 1); }
    greater(i, j){ return this.compare(this.heap[i], this.heap[j]); }
    push(element){
        this.heap.push(element);
        let i = this.size() - 1, j;
        while(i){
            j = this.parent(i);
            if(this.greater(i, j) == false) break;
            this.swap(i, j);
            i = j;
        }
    }
    pop(){
        if(this.empty()) return;
        this.heap[0] = this.heap[this.size() - 1];
        this.heap.pop();
        let i = 0, j, l = this.leftChild(i), r = this.rightChild(i);
        while((l < this.size() && this.greater(l, i)) ||
              (r < this.size() && this.greater(r, i))){
            j = (r < this.size() && this.greater(r, l) ? r : l);
            this.swap(i, j);
            i = j;
            l = this.leftChild(i);
            r = this.rightChild(i);
        }
    }
    front(){ return this.heap.length ? this.heap[0] : null; }
}

// --------------------------------------------------------------------------------
// Priority queue example
// --------------------------------------------------------------------------------
/* 
let pq = new PriorityQueue((a, b) => { return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0]; });

for(let i=0; i<10; ++i){
    let a = getRandInt(0, 10);
    let b = getRandInt(0, 10);
    pq.push([a, b]);
}

while(pq.size()){
    console.log(pq.front());
    pq.pop();
}
//*/

class DisjointSet{
    constructor(count = 0){
        this.parents;
        this.init(count);
    }
    init(count){
        this.parents = [];
        for(let i=0; i<count; ++i){
            this.parents.push(i);
        }
    }
    find(x){ return x = x == this.parents[x] ? x : this.find(this.parents[x]); }
    isSame(x, y){ return this.find(x) == this.find(y); }
    union(x, y){
        let px = this.find(x);
        let py = this.find(y);
        
        if(px == py) return false;
        this.parents[py] = px;
        return true;
    }
    print(){
        let index = "", line = "";
        for(let i=0; i<this.parents.length; ++i){
            if(i) index += " ", line += "-";
            index += i;
            line += "-";
        }
        console.log(index);
        console.log(line);

        let parents = "";
        for(let i=0; i<this.parents.length; ++i){
            if(i) parents += " ";
            parents += this.parents[i];
        }
        console.log(parents);
        console.log("");
    }
    clear(){
        this.parents = [];
    }
}

// --------------------------------------------------------------------------------
// Disjoint-set example
// --------------------------------------------------------------------------------
/*
let djs = new DisjointSet(5);

djs.print();

djs.union(1, 3);
djs.print();

djs.union(2, 4);
djs.print();

djs.union(4, 1);
djs.print();
//*/

class GrowingQueue{
    constructor(py = "newest"){
        this.array = [];
        this.priority = py;
    }
    push(element){ this.array.push(element); }
    delete(index){ 
        if(index > this.size() - 1) return false;
        this.array.splice(index, 1); 
    }
    getIndex(){
        switch(this.priority){
            case "newest": return this.array.length - 1; 
            case "oldest": return 0;
            case "middle": return this.array.length >> 1;
            case "random": return getRandInt(0, this.array.length - 1);
        }
    }
    get(py = null){
        if(this.empty()) return null;   
        if(py) this.priority = py;
        let index = this.getIndex();
        return {
            index: index,
            element: this.array[index]
        }
    }
    size(){ return this.array.length; }
    empty(){ return this.array.length ? false : true; }
    clear(){ this.array = []; }
}