import { Updatable } from "../Update";
import { assert } from "./misc";

export interface Feature<T> extends Updatable {
    readonly object: T;
    enabled: boolean;
}

export class FeatureMap<T extends { constructor: Function; }> {

    constructor(readonly object: T) { }

    private features_: { [key: string]: Feature<T> | undefined; } = {};

    addNew<TFeature extends Feature<T>, TArgs extends any[]>(
        ctor: new (object: T, ...args: TArgs) => TFeature,
        ...args: TArgs): void {

        const feature = new ctor(this.object, ...args);
        assert(this.features_[ctor.name] === undefined);
        this.features_[ctor.name] = feature;
    }

    getRequired<TFeature extends Feature<T>>(ctor: new (...args: any) => TFeature): TFeature {
        const f = this.features_[ctor.name];
        assert(f, `This object doesnt have feature ${ctor.name}.`);
        return f as TFeature;
    }

    get<TFeature extends Feature<T>>(ctor: new (...args: any) => TFeature): TFeature {
        const f = this.features_[ctor.name];
        return f as TFeature;
    }

    has(ctor: new (...args: any) => any): boolean {
        return this.features_[ctor.name] !== undefined;
    }

    *[Symbol.iterator](): Iterator<Feature<T>> {
        for (let k in this.features_) {
            const f = this.features_[k];
            if (this.features_.hasOwnProperty(k) && f !== undefined) {
                yield f;
            }
        }
    }
}
