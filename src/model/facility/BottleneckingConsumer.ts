import { DrawContext, Updatable, UpdateContext } from "../../Update";
import { assert, EPSILON, UI } from "../../utils";
import { Resource, ResourceAmount, ResourceStore } from "../Resource";

export class BottleneckingConsumerProducer implements Updatable {

    private received_ = new ResourceStore();
    private efficiency_: number;

    /**
     * If this consumer is not bottlenecked by supply, it is running at full
     * (1.0) efficiency. Otherwise the efficiency the proportion between
     * received and needed supply.
     */
    get efficiency() { return this.efficiency_; }

    private demanded_ = new Map<Resource, number>();

    constructor(
        private inputs: ResourceAmount[],
        private outputs: ResourceAmount[],
    ) {
        for (var input of this.inputs) {
            this.demanded_.set(input.resource, 0);
        }
    }

    update(ctx: UpdateContext, productionModifier = 1): void {
        const dt = ctx.time.dt;
        const sim = ctx.game.simulation;

        // compute bottleneck on incoming resources
        this.efficiency_ = productionModifier;
        var bottleneck = 1;
        for (let input of this.inputs) {
            assert(input.amount > EPSILON);
            const res = input.resource;
            const demanded = this.demanded_.get(res)!;
            const received = this.received_.read(res);
            this.efficiency_ = Math.min(this.efficiency_, received / input.amount / dt);
            bottleneck = demanded > EPSILON
                ? Math.min(bottleneck, received / demanded)
                : 0;
        }

        for (let input of this.inputs) {
            const res = input.resource;
            const demanded = this.demanded_.get(res)!;

            // take resources with respect to bottleneck
            const taken = this.received_.take(res, demanded * bottleneck);
            assert(taken === demanded * bottleneck);

            // return left resources
            sim.supply(res, this.received_.takeAll(res));

            // demand resources from the supply chain (for next frame)
            if (input.amount === 0) continue;
            const demand = input.amount * productionModifier * dt;
            sim.demand(input.resource, demand, x => this.received_.put(input.resource, x));
            this.demanded_.set(input.resource, demand);
        }

        // produce adequate outputs
        for (let output of this.outputs) {
            if (output.amount === 0) continue;
            const effc = this.efficiency_;
            sim.supply(output.resource, output.amount * effc * dt);
        }
    }

    printInfo(ctx: DrawContext) {
        const { term } = ctx;
        UI.printEfficiencySentence(term, this.efficiency);
        term.println('\nAt full capacity');
        term.withOrigin(term.cursorX + 2, term.cursorY, () => {
            UI.printlnResourceList(term, 'Produces ', this.outputs);
            UI.printlnResourceList(term, 'Consumes ', this.inputs);
        });
    }
}