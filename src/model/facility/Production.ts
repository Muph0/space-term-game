import { Simulation } from "../../Simulation";
import { DrawContext, UpdateContext } from "../../Update";
import { assert, UI } from "../../utils";
import { ResourceAmount, ResourcesAmounts, ResourceStore } from "../Resource";
import { BottleneckingConsumerProducer } from "./BottleneckingConsumer";
import { Facility, FacilityClass, FacilityOptions, FacilityType } from "./Facility";

export interface ProdictionFacilityOptions extends FacilityOptions {
    readonly in?: ResourcesAmounts;
    readonly out?: ResourcesAmounts;
    readonly capacity: ResourcesAmounts;
};

export class ProdictionFacilityType extends FacilityType {

    constructor(name: string, class_: FacilityClass, readonly opt: ProdictionFacilityOptions) {
        super(name, class_, opt);
    }
    create(sim: Simulation): ProdictionFacility {
        return new ProdictionFacility(sim, this,
            ResourcesAmounts.unwrapToList(this.opt.in || {}),
            ResourcesAmounts.unwrapToList(this.opt.out || {}),
            ResourcesAmounts.unwrapToList(this.opt.capacity),
        );
    }
}

class ProdictionFacility extends Facility {

    private consumer_: BottleneckingConsumerProducer;
    get efficiency() { return this.consumer_.efficiency; }

    constructor(
        sim: Simulation,
        readonly type: ProdictionFacilityType,
        protected inputs: ResourceAmount[],
        protected products: ResourceAmount[],
        protected capacities: ResourceAmount[],
    ) {
        super(sim, type);
        this.consumer_ = new BottleneckingConsumerProducer(inputs, products);
    }

    update(ctx: UpdateContext): void {
        const { dt } = ctx.time;

        // provide given capacity
        for (let cap of this.capacities) {
            this.sim.getSupplyOf(cap.resource).provideCapacity(cap.amount);
        }

        this.consumer_.update(ctx, this.powerLevel / this.maxPowerLevel);
    }

    printInfo(ctx: DrawContext): void {
        const { term } = ctx;
        this.consumer_.printInfo(ctx);
    }
}