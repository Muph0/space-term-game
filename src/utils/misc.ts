
export const EPSILON = Math.pow(10, -12);

export function assert(expr: any, message?: string): asserts expr {
    if (!expr) {
        if (message) {
            throw new Error(`Assertion failed: ${message}`);
        }
        throw new Error(`Assertion failed.`);
    }
}

export function select<Tin extends { [key: string]: any }, Tout>
    (inputObj: Tin, func: (item: Tin extends { [key: string]: infer TItem }
        ? TItem : never, key: string) => Tout): { [K in keyof Tin]: Tout } {
    const outputObject: any = {};

    for (let k in inputObj) {
        const item = inputObj[k];
        outputObject[k] = func(item, k);
    }

    return outputObject;
}


export function roundTo(value: number, places: number): number {
    return Math.floor(value * Math.pow(10, places)) * Math.pow(10, -places);
}

export function once<T>(lambda: () => T) {
    let value: T;
    let hasValue = false;
    return () => {
        if (!hasValue) {
            value = lambda();
            hasValue = true;
        }
        return value;
    }
}

export interface VersionedIterable<T> extends Iterable<T> {
    readonly version: number;
}

