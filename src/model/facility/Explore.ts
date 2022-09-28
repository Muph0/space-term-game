import { Simulation } from "../../Simulation";
import { UpdateContext, DrawContext } from "../../Update";
import { toDigits, UI } from "../../utils";
import { ResourceAmount, ResourcesAmounts } from "../Resource";
import { BottleneckingConsumerProducer } from "./BottleneckingConsumer";
import { Facility, FacilityOptions, FacilityType } from "./Facility";

export interface ExploreFacilityOptions extends FacilityOptions {
    readonly in?: ResourcesAmounts;
    readonly explore: number;
}

export class ExploreFacilityType extends FacilityType {
    constructor(name: string, readonly opt: ExploreFacilityOptions) {
        super(name, 'Exploration', opt);
    }
    create(sim: Simulation): Facility {
        return new ExploreFacility(sim, this,
            ResourcesAmounts.unwrapToList(this.opt.in),
        );
    }
}

export class ExploreFacility extends Facility {

    private consumer_: BottleneckingConsumerProducer;
    get explorePerSec() { return this.type.opt.explore; }

    constructor(
        sim: Simulation,
        readonly type: ExploreFacilityType,
        protected inputs: ResourceAmount[],
    ) {
        super(sim, type);
        this.consumer_ = new BottleneckingConsumerProducer(inputs, []);
    }

    update(ctx: UpdateContext): void {
        const { dt } = ctx.time;
        const { system } = this.sim;
        const exploreDelta = this.explorePerSec * dt;

        this.consumer_.update(ctx, this.powerLevel / this.maxPowerLevel);

        if (system) system.doExploration(exploreDelta * this.consumer_.efficiency);
    }

    printInfo(ctx: DrawContext): void {
        const { term } = ctx;
        this.consumer_.printInfo(ctx);
        term.println(`Explores ${toDigits(this.explorePerSec, 1)} per second.`);
    }

}