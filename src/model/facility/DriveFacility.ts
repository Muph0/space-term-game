import { Simulation } from "../../Simulation";
import { UpdateContext, DrawContext } from "../../Update";
import { breakLines, UI } from "../../utils";
import { ResourceAmount, ResourcesAmounts } from "../Resource";
import { BottleneckingConsumerProducer } from "./BottleneckingConsumer";
import { Facility, FacilityOptions, FacilityType } from "./Facility";

export interface DriveFacilityOptions extends FacilityOptions {
    in: ResourcesAmounts,
}
export class DriveFacilityType extends FacilityType {
    constructor(name: string, readonly opt: DriveFacilityOptions) {
        super(name, 'Drive', opt);
    }
    create(sim: Simulation): Facility {
        return new DriveFacility(sim, this,
            ResourcesAmounts.unwrapToList(this.opt.in),
        );
    }
}

export class DriveFacility extends Facility {

    private consumer_: BottleneckingConsumerProducer;
    constructor(
        sim: Simulation,
        readonly type: DriveFacilityType,
        readonly inputs: ResourceAmount[],
    ) {
        super(sim, type);
        this.consumer_ = new BottleneckingConsumerProducer(inputs, []);
    }

    update(ctx: UpdateContext): void {
        this.consumer_.update(ctx, this.powerLevel / this.maxPowerLevel);
    }
    printInfo(ctx: DrawContext): void {
        const { term } = ctx;
        this.consumer_.printInfo(ctx);
        term.println();
        const spaceLeft = term.width - term.cursorX - 2;
        if (this.description) UI.printLines(term, this.description, spaceLeft);
    }

}