import { assert } from "./misc";

export interface InventoryItem<T extends InventoryItem<T>> {

    /** Inventory this item is currently in. */
    in: Inventory<T> | undefined;

    /** Amount of space this item occupies in an inventory. */
    itemSize: number;
}

export abstract class Inventory<T extends InventoryItem<T>> {

    abstract readonly itemCount: number;
    abstract readonly capacity: number;
    abstract readonly parent: unknown;

    /**
     * Put item into this inventory (and take it from its containing inventory).
     * @param item The item.
     */
    abstract put(item: T): void;

    /**
     * Remove item from this inventory.
     * @param item The item.
     */
    abstract take(item: T): void;

    contains(item: T): boolean {
        return item.in === this;
    }

    abstract [Symbol.iterator](): IterableIterator<T>;
}

/**
 * Represents an inventory which has a limited capacity.
 */
export class Container<T extends InventoryItem<T>, Parent = unknown> extends Inventory<T> {

    private capacity_: number;
    private available_: number;
    private itemSet_ = [] as T[];

    get itemCount(): number { return this.itemSet_.length; }
    get capacity() { return this.capacity_; }
    get availableSpace() { return this.available_; }
    get takenSpace() { return this.capacity_ - this.available_; }

    constructor(
        readonly parent: Parent,
        capacity: number,
        iter?: Iterable<T>,
    ) {
        super();
        this.available_ = this.capacity_ = capacity;
        if (iter) for (let item of iter) {
            this.put(item);
        }
    }

    put(item: T): void {
        assert(this.available_ >= item.itemSize, `The ${item} doesn't fit into ${this}.`);

        item.in?.take(item);
        this.available_ -= item.itemSize;
        this.itemSet_.push(item);
        item.in = this;
    }

    take(item: T): void {
        assert(this.contains(item), `The ${item} is not in ${this}.`);

        this.available_ += item.itemSize;
        const index = this.itemSet_.indexOf(item);
        assert(index >= 0);
        this.itemSet_.splice(index, 1);
        item.in = undefined;
    }

    [Symbol.iterator](): IterableIterator<T> {
        return this.itemSet_[Symbol.iterator]();
    }
}

export class Slots<T extends InventoryItem<T>, Parent = unknown> extends Inventory<T> {

    private items_: (T | undefined)[];
    private itemCount_: number;

    get itemCount(): number { return this.itemCount_; }
    get capacity() { return this.items_.length; }

    constructor(
        readonly parent: Parent,
        capacity: number,
        iter?: Iterable<T>,
    ) {
        super();
        this.items_ = iter ? [...iter] : [];
        assert(this.items_.length <= capacity, 'Too many items in iterable.');
        while (this.items_.length < capacity) this.items_.push(undefined);
    }

    put(item: T): void {
        assert(this.itemCount_ < this.items_.length, `There is no free slot left in ${this}.`);
        const freeSlot = this.items_.indexOf(undefined);
        this.putAt(freeSlot, item);
    }
    putAt(slot: number, item: T) {
        assert(!this.items_[slot], `The slot ${slot} is occupied by ${this.items_[slot]}`);

        item.in?.take(item);
        this.items_[slot] = item;
        this.itemCount_++;
    }

    take(item: T): void {
        assert(this.contains(item), `The ${item} is not in ${this}.`);
        this.takeFrom(this.items_.indexOf(item));
    }
    takeFrom(slot: number): T {
        const item = this.items_[slot];
        assert(item, `Slot ${slot} is empty.`);

        this.items_[slot] = undefined;
        item.in = undefined;
        this.itemCount_--;
        return item;
    }

    get(slot: number) {
        assert(0 <= slot && slot < this.capacity);
        return this.items_[slot];
    }

    *[Symbol.iterator](): IterableIterator<T> {
        for (let item of this.items_) {
            if (item) yield item;
        }
    }

    get slots(): Iterable<number> {
        return this.items_.map((_, i) => i);
    }
}