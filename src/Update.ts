import { Terminal } from "./display/Terminal";
import { Game } from "./Game";
import { KeyboardState } from "./platform/Keyboard";

export interface TimeContext {
    /** Number of seconds elapsed in game. */
    readonly seconds: number;
    /** Number of seconds passed since last frame. */
    readonly dt: number;
    /** Number of a frame. */
    readonly frameNumber: number;
    /** Approximate frame frequency. */
    readonly fps: number;
}

export interface UpdateContext {
    readonly kbs: KeyboardState;
    readonly time: TimeContext;
    readonly game: Game;
}

export interface Updatable {
    update(ctx: UpdateContext): void;
}

export interface DrawContext {
    readonly term: Terminal;
    readonly time: TimeContext;
}

export interface Drawable {
    draw(ctx: DrawContext): void;
}

export interface Describable {
    readonly name: string;
    readonly description?: string;
}