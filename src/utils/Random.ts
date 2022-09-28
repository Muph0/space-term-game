import { assert } from './misc'

export type Rng
    = UniformRng
    | GaussianRng
    | RoofRng
    | number;

declare global {
    interface Number {
        sample(): number;
    }
}
Number.prototype.sample = function () { return this; }

export namespace Rng {
    export function uniform(min: number, max: number): Rng {
        return new UniformRng(min, max);
    }
    export function gaussian(mean: number, stdev: number): Rng {
        return new GaussianRng(mean, stdev);
    }
    export function roof(min: number, max: number, mean?: number): Rng {
        return new RoofRng(min, max, mean);
    }
}

export namespace Random {
    export function select<T>(array: T[], weights?: number[]): T {
        weights = weights || array.map(() => 1);
        assert(array.length === weights.length);
        const sum = weights.reduce((a, b) => a + b);
        var roll = uniform(0, sum);
        for (let i = 0; i < array.length; i++) {
            roll -= weights[i];
            if (roll < 0) {
                return array[i];
            }
        }
        throw new Error('unreachable');
    }
    export function uniform(min: number, max: number): number {
        assert(min <= max);
        return min + (max - min) * Math.random()
    }
    export function uniformInt(min: number, max: number): number {
        assert(min <= max);
        return Math.floor(min + (max + 0.999999999 - min) * Math.random())
    }
    export function gaussian(mean: number, stdev: number) {
        var u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const norm = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return norm * stdev + mean;
    }
    export function roof(min: number, max: number, mean = (min + max) / 2) {
        const peak = RoofRng.meanToPeak(min, max, mean);
        const x = Math.random();
        const S = (max - min) / 2;
        const left = peak - min;
        const right = max - peak;
        const split = Math.pow(min - x, 2) / (2 * left * S);
        if (x <= split) {
            return min + Math.sqrt(2 * S * x * left);
        } else {
            return max - Math.sqrt(2 * S * (1 - x) * right);
        }
    }
}



interface IRng {
    readonly type: string;
    sample(): number;
}
class UniformRng implements IRng {
    type: 'uniform' = 'uniform';
    constructor(
        readonly min: number,
        readonly max: number,
    ) {
        assert(min <= max);
    }
    sample() { return Random.uniform(this.min, this.max); }
}
class GaussianRng implements IRng {
    type: 'gaussian' = 'gaussian';
    constructor(
        readonly mean: number,
        readonly stdev: number,
    ) { }
    sample() { return Random.gaussian(this.mean, this.stdev); }
}
/** Produces numbers with roof shaped distribution /\ */
class RoofRng implements IRng {
    type: 'roof';
    private readonly peak: number;
    constructor(
        readonly min: number,
        readonly max: number,
        mean = (min + max) / 2,
    ) {
        this.peak = RoofRng.meanToPeak(min, max, mean);
    }
    static meanToPeak(min: number, max: number, mean: number) {
        const l = (2 * min + max) / 3;
        const r = (min + 2 * max) / 3;
        assert(l <= mean && mean <= r, `Mean out of range, must be in the middle third [${l},${r}].`);
        return 3 * mean - min - max;
    }
    sample(): number {
        return Random.roof(this.min, this.max, this.peak);
    }

}



interface RandomSource {
    unif01(): number;
    randint(): number;
}

export const nativeRandomSource: RandomSource = {
    unif01: function (): number {
        return Math.random();
    },
    randint: function (): number {
        const INT_MAX = -(1 << 31);
        return Math.floor((2 * Math.random() - 1) * INT_MAX);
    }
}

export class SeededRandomSource implements RandomSource {

    constructor(
        public seed = 156567,
    ) { }

    private shift(k: number) {
        while (k-- > 0) {
            const lsb = this.seed & 1;
            this.seed = this.seed >> 1;
            if (lsb) this.seed ^= 0x80200004;
        }
    }

    unif01(): number {
        const int = this.randint();
        const INT_MAX = -(1 << 31);
        return Math.abs(int / INT_MAX);
    }
    randint(): number {
        this.shift(33);
        return this.seed;
    }

}
