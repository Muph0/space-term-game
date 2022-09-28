import { Describable, Updatable, UpdateContext } from "../../Update";
import { ResourceHarvestFeature } from "../objects/ObjectFeatures";
import { SpaceObject } from "../objects/SpaceObject";
import { Ship } from "./Ship";

export abstract class ShipJob implements Updatable, Describable {

    constructor(
        readonly ship: Ship,
    ) { }

    abstract readonly name: string;
    abstract readonly description: string;

    abstract update(ctx: UpdateContext): void;
}

export class ShipMiningJob extends ShipJob {

    constructor(
        ship: Ship,
        readonly target: ResourceHarvestFeature,
    ) {
        super(ship);
    }

    get name() { return `Mine: ${this.target.object.name}`; }
    readonly description = `Ship will go to ${this.target.object.name} and
    start mining until it fills up its cargo.`.replace(/\s+/gm, ' ');

    update(ctx: UpdateContext): void {
        // TODO: implement mining AI
    }

}


export class ShipExploreJob extends ShipJob {

    constructor(
        ship: Ship,
        readonly target: SpaceObject,
    ) {
        super(ship);
    }

    name: string;
    description: string;
    update(ctx: UpdateContext): void {
        throw new Error("Method not implemented.");
    }

}