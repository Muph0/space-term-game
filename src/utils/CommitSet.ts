
/**
 * Like a normal Set<T>, but modifications made
 * during iteration are commited at the end
 * of iteration.
 */
export class CommitSet<T> implements Set<T> {
    private set = new Set<T>();
    private iteratedSet: Set<T>;
    private iterationDepth = 0;
    size: number;

    constructor(iterable?: Iterable<T>) {
        this.set = new Set(iterable);
        this.iteratedSet = this.set;
    }

    add(value: T): this {
        this.ensureModifiable();
        this.set.add(value);
        return this;
    }
    clear(): void {
        this.ensureModifiable();
        this.set.clear();
    }
    delete(value: T): boolean {
        this.ensureModifiable();
        return this.set.delete(value);
    }
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
        for (var value of this[Symbol.iterator]()) {
            callbackfn.call(thisArg, value, value, this.set);
        }
    }
    has(value: T): boolean {
        return this.set.has(value);
    }
    *entries(): IterableIterator<[T, T]> {
        for (var value of this[Symbol.iterator]()) {
            yield [value, value];
        }
    }
    keys(): IterableIterator<T> { return this[Symbol.iterator](); }
    values(): IterableIterator<T> { return this[Symbol.iterator](); }
    *[Symbol.iterator](): IterableIterator<T> {
        this.iterationDepth++;
        try {
            for (var value of this.set.keys())
                yield value;
        } finally {
            this.iterationDepth--;
            this.tryCommit();
        }
    }
    get [Symbol.toStringTag](): string { return this.set.toString(); }

    /** Commit all changes done during iteration. */
    private tryCommit() {
        if (this.iterationDepth === 0)
            this.iteratedSet = this.set;
    }

    private ensureModifiable() {
        if (this.set === this.iteratedSet && this.iterationDepth === 0) {
            this.set = new Set(this.iteratedSet);
        }
    }
}
