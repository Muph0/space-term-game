import { Simulation } from '../../Simulation';
import { Updatable, UpdateContext } from '../../Update';
import { assert } from '../../utils';
import { FutureAction } from '../../utils/FutureAction';
import { Inventory, InventoryItem, Slots } from '../../utils/Inventory';
import { SpaceObject } from '../objects/SpaceObject';
import { PreDressedModule, ShipModule } from './module/ShipModule';
import { ShipAction } from './ShipAction';
import { ShipJob } from './ShipJob';

export class Ship extends SpaceObject implements InventoryItem<Ship> {

    readonly modules: Slots<ShipModule>;
    readonly in: Inventory<Ship> | undefined;
    get itemSize() { return this.type.opt.size; }

    public readonly action = new FutureAction<ShipAction>();
    public job: ShipJob | undefined = undefined;

    get jobName() { return this.job ? this.job?.name : '- idle -'; }

    constructor(
        readonly sim: Simulation,
        name: string,
        readonly type: ShipBodyType,
        modules: Iterable<ShipModule>,
        public hitpoins: number,
    ) {
        super(name);
        this.modules = new Slots(this, type.opt.modcap, modules)
    }

    get containerName() {
        if (this.in === undefined) return 'in space';
        if (this.in === this.sim.station.hangar) {
            return 'hangar';
        }
        if (this.in === this.sim.station.hangar) {
            return 'hangar';
        }
    }

    update(ctx: UpdateContext): void {
        super.update(ctx);
        this.job?.update(ctx);
    }
}

export type ShipOptions = {
    readonly size: number;
    /** Ship's max HP */
    readonly hp: number;
    readonly speed: number;
    /** Module capacity */
    readonly modcap: number;
};

export class ShipBodyType {
    private nameCounter_: Map<string, number>;

    constructor(
        readonly name: string,
        readonly opt: ShipOptions,
    ) {
        this.resetNames();
    }

    create(sim: Simulation, moduleTypes: PreDressedModule[], rename?: string) {
        assert(moduleTypes.length <= this.opt.modcap, 'Too many modules');
        const name = this.nextName(rename ?? this.name);
        return new Ship(sim, name, this, moduleTypes.map(m => m.create()), this.opt.hp);
    }

    resetNames() { this.nameCounter_ = new Map(); }

    private nextName(name: string): string {
        var count = this.nameCounter_.get(name);
        if (count === undefined) {
            count = 0;
        }
        this.nameCounter_.set(name, count + 1);
        //return `${name} ${count + 1}`;
        return name;
    }
}


export class PreDressedShip {
    constructor(
        readonly type: ShipBodyType,
        readonly modules: PreDressedModule[],
        readonly prefix?: string,
    ) { }
    create(sim: Simulation) {
        const ship = this.prefix
            ? this.type.create(sim, this.modules, `${this.prefix} ${this.type.name}`)
            : this.type.create(sim, this.modules);
        return ship;
    }
}
