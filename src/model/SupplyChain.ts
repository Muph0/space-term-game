import { Updatable, UpdateContext } from "../Update";
import { EPSILON, Mathx, roundTo } from "../utils";
import { Resource, RESOURCES } from "./Resource";

export type SupplyChainList = {
    [K in keyof RESOURCES]: SupplyChain
};

type SupplyReceiver = {
    amount: number;
    callback?: (amount: number) => any;
}

export class SupplyChain implements Updatable {

    private frameSupply_ = 0;
    private frameDemand_ = 0;
    private frameCapacity_ = 0;
    private receivers_: SupplyReceiver[] = [];

    private storage_: number = 0;
    get inStorage() { return this.storage_; }
    get inStorageAmount() { return this.resource.amount(this.storage_); }

    private capacity_: number = 0;
    get capacity() { return this.capacity_; }
    get capacityAmount() { return this.resource.amount(this.capacity_); }

    private frameDelta_: number;
    private deltaPerSec_: number;
    get deltaPerSec(): number { return this.deltaPerSec_; }

    private turnover_: number = 0;
    get turnover() { return this.turnover_; }

    private inactiveTime_ = 0;
    get inactiveTime() { return this.inactiveTime_; }

    constructor(readonly resource: Resource) { }

    update(ctx: UpdateContext): void {
        const dt = ctx.time.dt;
        const supply = this.frameSupply_ + this.storage_;
        const demand = this.frameDemand_;
        const receivers = this.receivers_.splice(0, this.receivers_.length);

        this.turnover_ = Math.min(supply, demand);
        this.frameDelta_ = this.frameSupply_ - this.frameDemand_;
        this.storage_ = Mathx.clamp(0, this.capacity, this.storage_ + this.frameDelta_);
        this.deltaPerSec_ = this.frameDelta_ / dt;
        this.capacity_ = this.frameCapacity_;

        this.frameSupply_ = this.frameDemand_ = this.frameCapacity_ = 0;

        if (demand > EPSILON) {
            const satisfy = Math.min(supply / demand, 1);
            for (let rec of receivers) {
                if (rec.callback) rec.callback(satisfy * rec.amount);
            }
        }

        if (supply === 0 && demand === 0)
            this.inactiveTime_ += ctx.time.dt;
    }

    provideCapacity(amount: number) {
        this.frameCapacity_ += amount;
    }

    supply(amount: number) {
        if (amount > EPSILON) {
            this.frameSupply_ += amount;
        }
    }

    demand(amount: number, callback?: (amt: number) => any) {
        if (amount > EPSILON) {
            this.frameDemand_ += amount;
            this.receivers_.push({ amount, callback });
        }
    }
}
