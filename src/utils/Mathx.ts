import { assert } from './misc';

export namespace Mathx {

    export function lerp(a: number, b: number, weight: number) {
        assert(0 <= weight && weight <= 1, `Argument weight:${weight} out of range.`);
        return a * (1 - weight) + b * weight;
    }

    export function clamp(min: number, max: number, x: number) {
        return Math.min(max, Math.max(min, x));
    }

    export const sphereVolume = (r: number) => 4 / 3 * Math.PI * Math.pow(r, 3);
    export const sphereSurface = (r: number) => 4 * Math.PI * Math.pow(r, 2);

}