
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;


export type TypeEquals<A, B> = A extends B ? (B extends A ? true : false) : false;

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};