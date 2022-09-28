import { Terminal } from "../display/Terminal";
import { amountWithUnitSI, Rng, toDigits } from "../utils";

export class Resource {
    readonly id: keyof RESOURCES;
    constructor(
        readonly name: string,
        readonly unit: string,
    ) {
        setTimeout(() => {
            let k: keyof RESOURCES;
            for (k in RESOURCES) {
                if (RESOURCES[k] === this)
                    (this as any).id = k;
            }
        }, 0);
    }

    printName(term: Terminal) {
        term.print(this.name);
    }

    amount(amount: number) {
        return new ResourceAmount(this, amount);
    }
    resInfo(abundance: number) {
        return new ResourceHarvestInfo(this, abundance);
    }

    static get All() { return Object.values(RESOURCES); }
}

export type RESOURCES = typeof RESOURCES;
export const RESOURCES = Object.freeze({
    energy: new Resource('Power', 'W'),
    steel: new Resource('Steel', 'g'),
    fuel: new Resource('Fuel', 'g'),
    rareMetals: new Resource('Rare metals', 'g'),
});

export class ResourceAmount {
    constructor(
        readonly resource: Resource,
        readonly amount: number,
    ) { }
    toString() {
        const conv = amountWithUnitSI(this.amount, 0);
        return `${toDigits(conv.amount, 2)}${conv.unit}${this.resource.unit}`;
    }
    print(term: Terminal, withName = false) {
        term.print(this.toString());
        term.print(' of ');
        this.resource.printName(term);
    }
}
export class ResourceHarvestInfo {
    constructor(
        readonly material: Resource,
        readonly abundance: number,
    ) { }
}

export type ResourceRanges = {
    [k in keyof RESOURCES]?: Rng
}

export type ResourcesAmounts = Partial<{
    [K in keyof RESOURCES]: number
}>;
export namespace ResourcesAmounts {
    export function unwrapToList(amts: ResourcesAmounts | undefined) {
        const result = [];
        let k: keyof ResourcesAmounts;
        if (amts) for (k in amts) {
            result.push(RESOURCES[k].amount(amts[k]!));
        }
        return result;
    }
}

export class ResourceStore implements Iterable<ResourceAmount> {
    private contents_ = new Map<Resource['id'], number>();

    constructor() {
        let k: keyof RESOURCES;
        for (k in RESOURCES) {
            this.contents_.set(k, 0);
        }
    }

    readAmount(res: Resource): ResourceAmount {
        return res.amount(this.contents_.get(res.id)!);
    }
    read(res: Resource): number {
        return this.contents_.get(res.id)!;
    }

    putAmount(amt: ResourceAmount) {
        return this.put(amt.resource, amt.amount);
    }
    put(res: Resource, amount: number) {
        const storedAmount = this.contents_.get(res.id)!;
        this.contents_.set(res.id, storedAmount + amount);
    }

    takeAmount(res: ResourceAmount): ResourceAmount {
        return res.resource.amount(this.take(res.resource, res.amount));
    }
    take(res: Resource, amount: number): number {
        const storedAmount = this.contents_.get(res.id)!;
        this.contents_.set(res.id, Math.max(0, storedAmount - amount));
        return Math.min(amount, storedAmount);
    }
    takeAll(res: Resource): number {
        const storedAmount = this.contents_.get(res.id)!;
        this.contents_.set(res.id, 0);
        return storedAmount;
    }

    *[Symbol.iterator](): Iterator<ResourceAmount, any, undefined> {
        for (let kv of this.contents_) {
            yield RESOURCES[kv[0]].amount(kv[1]);
        }
    }
}