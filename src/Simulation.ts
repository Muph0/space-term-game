import { RESOURCES, Resource, ResourceAmount } from "./model/Resource";
import { Ship } from "./model/ship/Ship";
import { Station } from "./model/station/Station";
import { SupplyChain, SupplyChainList } from "./model/SupplyChain";
import { StarSystem } from "./model/objects/StarSystem";
import { Updatable, UpdateContext } from "./Update";
import { assert, select } from "./utils";

export class Simulation implements Updatable {

    private system_: StarSystem;
    get system() { return this.system_; }

    private station_: Station;
    get station() { return this.station_; }

    public readonly supplyChains: Readonly<SupplyChainList>;

    constructor() {
        this.supplyChains = select(RESOURCES, res => new SupplyChain(res));
    }

    getSupplyOf(res: Resource): SupplyChain { return this.supplyChains[res.id]; }
    demand(res: Resource, amount: number, callback: (n: number) => any) {
        return this.getSupplyOf(res).demand(amount, callback);
    }
    supply(res: Resource, amount: number) {
        return this.getSupplyOf(res).supply(amount);
    }
    supplyAmount(amount: ResourceAmount) {
        return this.getSupplyOf(amount.resource).supply(amount.amount);
    }

    newSystem(system: StarSystem) {
        this.system_ = system;
        this.station_?.enterSystem(system);
    }
    newStation(station: Station) {
        assert(!this.station_);
        this.station_ = station;
        if (this.system_) station.enterSystem(this.system_);
    }

    getAllShips(): ReadonlyArray<Ship> {
        return this.system_.ships;
    }

    update(ctx: UpdateContext): void {

        this.system?.update(ctx);

        if (this.station) {
            this.station.update(ctx);
            for (let fac of this.station.facilts) {
                fac?.update(ctx);
            }
        }

        for (let supply of Object.values(this.supplyChains)) {
            supply.update(ctx);
        }
    }

}