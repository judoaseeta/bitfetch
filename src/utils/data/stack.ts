class StackNode<Data> {
    private _data: Data;
    _prev:StackNode<Data> | null = null;
    constructor(data: Data) {
        this._data = data;
    }
    get data () {
        return this._data;
    }
}

class Stack<Data> {
    private _top: StackNode<Data>| null = null;
    constructor(data?: Data) {
        if(data) this.push(data);
    }
    isEmpty() {
        return !this._top;
    }
    pop() {
        let currentLast: StackNode<Data>;
        if(this._top && this._top._prev) {
            currentLast = this._top;
            this._top = currentLast._prev;
            return currentLast;
        } else if(this._top) {
            currentLast = this._top;
            this._top = null;
            return currentLast;
        }
        return this._top;
    }
    push(data: Data) {
        let newNode = new StackNode(data);
        const lastTop = this._top;
        newNode._prev = lastTop;
        this._top = newNode;
    }
    top() {
        return this._top;
    }
}

export default Stack;
