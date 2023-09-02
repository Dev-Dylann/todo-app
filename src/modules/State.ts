export default class State<T> {
    private data: T

    constructor(value: T) {
        this.data = value
    }

    getState(): T {
        return this.data
    }

    setState(value: T): void {
        this.data = value
    }
}