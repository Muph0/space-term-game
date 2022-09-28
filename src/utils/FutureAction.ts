import { TimeContext, Updatable, UpdateContext } from "../Update";
import { assert } from "./misc";

export interface Action {
    do?(): boolean | undefined;
}

export class FutureAction<T extends Action> implements Updatable {

    private nextStop_: number | undefined;
    private started_ = 0;
    private action_: T | undefined;
    private time: TimeContext;

    get action(): T | undefined { return this.action_; }
    set action(value: T | undefined) { this.action_ = value; }

    get isRunning() { return this.nextStop_ !== undefined; }
    get remainingSeconds() {
        if (this.nextStop_ === undefined) throw new Error("This job is not running.");
        return Math.max(0, this.nextStop_ - this.time.seconds);
    }
    get progress() {
        if (this.nextStop_ === undefined) throw new Error("This job is not running.");
        return 1.0 - this.remainingSeconds / (this.nextStop_ - this.started_);
    }

    /**
     * Plan the action to execute after specified amount of time
     * @param delaySec Time in which the action will be performed.
     * @param action The action to perform. If omitted, the last action is reused.
     */
    public start(delaySec: number, action?: T) {
        assert(!this.isRunning, "This timer is already running.");
        if (action) this.action_ = action;
        assert(this.action_, "No action was given.");
        assert(delaySec >= 0, "Delay must be non-negative.");

        this.nextStop_ = this.time.seconds + delaySec;
        this.started_ = this.time.seconds;
    }

    public stop() {
        assert(this.isRunning, "This timer is not running.");
        this.nextStop_ = undefined;
    }

    public update(ctx: UpdateContext): void {
        this.time = ctx.time;

        if (this.nextStop_ && this.time.seconds >= this.nextStop_) {
            assert(this.action_, "No action was given.");
            const repeat = this.action_.do?.();
            if (!repeat) {
                this.nextStop_ = undefined;
            }
        }
    }
}
