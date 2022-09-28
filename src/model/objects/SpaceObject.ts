import { Describable, Updatable, UpdateContext } from "../../Update";
import { ArraySet } from "../../utils/ArraySet";
import { FeatureMap } from "../../utils/FeatureMap";
import { lazy } from "../../utils/lazy";
import { Vec2, Vec3 } from "../../utils/Vec";

const CHILDREN = Symbol('children');

export class SpaceObject implements Updatable, Describable {

    constructor(
        public name: string,
        public description?: string,
    ) { }

    readonly position: Vec3;
    private parent_: AstroObject;
    get parent() { return this.parent_; }

    readonly features = new FeatureMap<SpaceObject>(this);
    hasFeature(ctor: new (...args: any) => any): boolean {
        return this.features.has(ctor);
    }

    update(ctx: UpdateContext): void { }

    destroy() {
        this.parent[CHILDREN].delete(this);
    }

    viewRadius() {
        return 1.0;
    }

    distanceTo(other: SpaceObject) {
        return this.position.distanceTo(other.position);
    }
}

export class AstroObject extends SpaceObject {

    constructor(
        name: string,
        public radius: number,
        public mass: number,
        description?: string,
    ) { super(name, description); }

    readonly position = new Vec3(0, 0, 0);
    public discovered = false;

    viewRadius() {
        return lazy(this.findAllChildren())
            .map(o => o.position.clone().sub(this.position).length())
            .max() ?? this.radius;
    }

    protected [CHILDREN] = new ArraySet<SpaceObject>();
    get children(): Iterable<SpaceObject> { return this[CHILDREN]; }
    addChild(...params: SpaceObject[]) {
        for (let child of params) {
            this[CHILDREN].add(child);
            (child as any).parent_ = this;
        }
    }
    *findAllChildren(pred?: (ch: SpaceObject) => boolean, stopRecursion = false): Generator<SpaceObject, void> {
        for (let ch of this.children) {
            const predResult = !pred || pred(ch);
            if (predResult) {
                yield ch;
            }
            if ((predResult || !stopRecursion) && ch instanceof AstroObject) {
                yield* ch.findAllChildren(pred);
            }
        }
    }




    update(ctx: UpdateContext): void {
        for (let feature of this.features) {
            feature.update(ctx);
        }
        for (let child of this[CHILDREN]) {
            child.update(ctx);
        }
    }


}
