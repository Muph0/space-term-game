import { assert } from "./misc";

export type Pos2 = { x: number, y: number };
export type Pos3 = Pos2 & { z: number };

export class Vec2 {

    constructor(
        public x: number,
        public y: number,
    ) { }

    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    lengthSq() { return (this.x * this.x + this.y * this.y); }

    clone(): Vec2 { return new Vec2(this.x, this.y); }
    add(other: Pos2): Vec2;
    add(x: number, y: number): Vec2;
    add(a: any, b?: any) {
        if (b !== undefined) {
            this.x += a; this.y += b;
        } else {
            this.x += a.x; this.y += a.y;
        }
        return this;
    }

    sub(other: Pos2): Vec2;
    sub(x: number, y: number): Vec2;
    sub(a: any, b?: any) {
        if (b !== undefined) {
            this.x -= a; this.y -= b;
        } else {
            this.x -= a.x; this.y -= a.y;
        }
        return this;
    }

    set(other: Pos2): Vec2;
    set(x: number, y: number): Vec2;
    set(a: any, b?: any) {
        if (b !== undefined) {
            this.x = a; this.y = b;
        } else {
            this.x = a.x; this.y = a.y;
        }
        return this;
    }

    scale(scalar: number) { this.x *= scalar; this.y *= scalar; return this; }
    scaleX(scalar: number) { this.x *= scalar; return this; }
    scaleY(scalar: number) { this.y *= scalar; return this; }

    dot(other: Pos2): number;
    dot(x: number, y: number): number;
    dot(other: any, y?: any) {
        if (y !== undefined) {
            return this.x * other + this.y * y;
        } else {
            return this.x * other.x + this.y * other.y;
        }
    }

    mix(other: Pos2, amount: number) {
        assert(0 <= amount && amount <= 1, `Amount ${amount} out of range.`);
        this.x = this.x * (1 - amount) + amount * other.x;
        this.y = this.y * (1 - amount) + amount * other.y;
        return this;
    }

    rotRad(rad: number) {
        const sin = Math.sin(rad), cos = Math.cos(rad);
        const x = this.x, y = this.y;
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
    }
    rotDeg(deg: number) {
        const rad = deg / 180 * Math.PI;
        this.rotRad(rad);
        return this;
    }

}

export class Vec3 {

    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) { }

    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    lengthSq() { return (this.x * this.x + this.y * this.y + this.z * this.z); }

    clone(): Vec3 { return new Vec3(this.x, this.y, this.z); }
    add(other: Pos3): Vec3;
    add(x: number, y: number, z: number): Vec3;
    add(x: number | Pos3, y?: number, z?: number) {
        if (typeof x === 'number') {
            this.x += x; this.y += y!; this.z += z!;
        } else {
            this.x += x.x; this.y += x.y!; this.z += x.z!;
        }
        return this;
    }

    sub(other: Pos3): Vec3;
    sub(x: number, y: number, z: number): Vec3;
    sub(x: number | Pos3, y?: number, z?: number) {
        if (typeof x === 'number') {
            this.x -= x; this.y -= y!; this.z -= z!;
        } else {
            this.x -= x.x; this.y -= x.y!; this.z -= x.z!;
        }
        return this;
    }

    set(other: Pos3): Vec3;
    set(x: number, y: number, z: number): Vec3;
    set(x: number | Pos3, y?: number, z?: number) {
        if (typeof x === 'number') {
            this.x = x; this.y = y!; this.z = z!;
        } else {
            this.x = x.x; this.y = x.y!; this.z = x.z!;
        }
        return this;
    }

    scale(scalar: number) { this.x *= scalar; this.y *= scalar; this.z *= scalar; return this; }
    scaleX(scalar: number) { this.x *= scalar; return this; }
    scaleY(scalar: number) { this.y *= scalar; return this; }
    scaleZ(scalar: number) { this.y *= scalar; return this; }

    dot(other: Pos3): number;
    dot(x: number, y: number, z: number): number;
    dot(x: number | Pos3, y?: number, z?: number) {
        if (typeof x === 'number') {
            return this.x * x + this.y * y! + this.z * z!;
        } else {
            return this.x * x.x + this.y * x.y! + this.z * x.z!;
        }
    }

    distanceTo(other: Vec3) {
        const x = this.x - other.x;
        const y = this.y - other.y;
        const z = this.z - other.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    mix(other: Pos3, amount: number) {
        assert(0 <= amount && amount <= 1, `Amount ${amount} out of range.`);
        this.x = this.x * (1 - amount) + amount * other.x;
        this.y = this.y * (1 - amount) + amount * other.y;
        this.z = this.z * (1 - amount) + amount * other.z;
        return this;
    }

    rotZ(rad: number) {
        const sin = Math.sin(rad), cos = Math.cos(rad);
        const x = this.x, y = this.y;
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
    }


    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        this.z = Math.abs(this.z);
    }

}
