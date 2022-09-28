import { ShipBodyType, Ship, PreDressedShip } from '../ship/Ship';
import { Facility, FacilityType } from '../facility/Facility';
import { Simulation } from '../../Simulation';
import { Updatable, UpdateContext } from '../../Update';
import { Resource, RESOURCES } from '../Resource';
import { StarSystem } from '../objects/StarSystem';
import { Container, Slots } from '../../utils/Inventory';

export class StationType {
    constructor(
        public readonly name: string,
        public readonly facilities: FacilityType[],
        public readonly initModulecap: number,
        public readonly hangar: PreDressedShip[],
        public readonly initHangarcap: number,
    ) { }
    create(sim: Simulation) {
        const newFaclts = new Array(this.initModulecap).fill(undefined);
        for (let i = 0; i < this.facilities.length; i++)
            newFaclts[i] = this.facilities[i].create(sim);

        return new Station(this.name, newFaclts, this.initHangarcap, this.hangar.map(s => s.create(sim)), this.initHangarcap);
    }
}

export class Station implements Updatable {

    public readonly hangar: Container<Ship>;

    constructor(
        readonly name: string,
        readonly facilts: Facility[],
        readonly modulecap: number,
        ships: Ship[],
        readonly hangarcap: number,
    ) {
        this.hangar = new Container(this, hangarcap, ships);
    }

    enterSystem(system: StarSystem) {
        system.ships.push(...this.hangar);
    }

    update(ctx: UpdateContext): void {
        const sim = ctx.game.simulation;

        for (let res of Resource.All) {
            if (res.id === 'energy') continue;
            sim.getSupplyOf(res).provideCapacity(10);
        }

    }
}



