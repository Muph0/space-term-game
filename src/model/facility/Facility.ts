import { Simulation } from "../../Simulation";
import { DrawContext, Updatable, UpdateContext } from "../../Update";
import { romanNumber } from "../../utils";
import { ResourcesAmounts } from "../Resource";
import { FACILITIES } from "./FacilityDefinitions";

export interface FacilityOptions {
    readonly tier: number;
    readonly maxPower: number;
    readonly desc?: string;
    readonly startPower?: number;
    readonly upgrade?: {
        readonly to: keyof FACILITIES;
        readonly cost: ResourcesAmounts;
    };
}

export type FacilityClass = 'Power' | 'Exploration' | 'Refinery' | 'Drive';

export abstract class FacilityType {
    constructor(
        readonly name: string,
        readonly class_: FacilityClass,
        readonly opt: FacilityOptions,
    ) { }

    abstract create(sim: Simulation): Facility;

    classAndLvl() { return `${this.class_} ${romanNumber(this.opt.tier)}`; }
}

export abstract class Facility implements Updatable {

    public powerLevel: number;
    get maxPowerLevel() { return this.type.opt.maxPower; }
    constructor(
        readonly sim: Simulation,
        readonly type: FacilityType,
    ) {
        this.powerLevel = type.opt.startPower ?? type.opt.maxPower;
    }

    abstract update(ctx: UpdateContext): void;
    abstract printInfo(ctx: DrawContext): void;

    get description() { return this.type.opt.desc; }
}