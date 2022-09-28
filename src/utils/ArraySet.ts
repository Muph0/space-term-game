
export class ArraySet<T> implements Set<T> {
    get size(): number { return this.items_.length; }

    private readonly items_: T[] = [];

    add(value: T): this {
        if (!this.has(value)) this.items_.push(value);
        return this;
    }
    clear(): void { this.items_.splice(0); }
    delete(value: T): boolean {
        const index = this.indexOf(value);
        if (index >= 0) {
            this.items_.splice(index, 1);
            return true;
        }
        return false;
    }
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
        for (var value of this[Symbol.iterator]()) {
            callbackfn.call(thisArg, value, value, this);
        }
    }
    has(value: T): boolean { return this.indexOf(value) >= 0; }
    indexOf(value: T, fromIndex?: number): number { return this.items_.indexOf(value, fromIndex); }
    *entries(): IterableIterator<[T, T]> {
        for (var value of this[Symbol.iterator]()) {
            yield [value, value];
        }
    }
    keys(): IterableIterator<T> { return this[Symbol.iterator](); }
    values(): IterableIterator<T> { return this[Symbol.iterator](); }
    *[Symbol.iterator](): IterableIterator<T> {
        for (var value of this.items_)
            yield value;
    }
    get [Symbol.toStringTag](): string { return this.items_.toString(); }

}