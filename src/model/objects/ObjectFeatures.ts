import { UpdateContext } from "../../Update";
import { Feature } from "../../utils/FeatureMap";
import { Vec3 } from "../../utils/Vec";
import { ResourceHarvestInfo } from "../Resource";
import { AstroObject } from "./SpaceObject";


export class ResourceHarvestFeature implements Feature<AstroObject> {

    public enabled = true;
    constructor(
        readonly object: AstroObject,
        readonly resources: ResourceHarvestInfo[],
    ) { }

    update(ctx: UpdateContext): void { }
}

const G = 6.674e-11;
export class OrbitsParentFeature implements Feature<AstroObject> {

    private relative: Vec3;

    public enabled = true;
    constructor(
        readonly object: AstroObject,
        readonly radius: number,
        startRadians: number = 0,
    ) {
        this.relative = new Vec3(radius, 0, 0).rotZ(startRadians);
    }

    get period() {
        const mu = this.object.parent.mass * G;
        return 2 * Math.PI * Math.sqrt(Math.pow(this.radius, 3) / mu);
    }

    update(ctx: UpdateContext): void {
        let angle = 2 * Math.PI * ctx.time.seconds / this.period;
        angle *= 7*24*3600;
        angle *= 52/3600;

        this.object.position.set(this.relative).rotZ(angle).add(this.object.parent.position);
    }

}