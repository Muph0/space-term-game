export * from './Keys';

import { isKeyPrintable, Keys } from './Keys';

export class KeyboardState {
    private keymap_ = new Map<Keys, number>();

    constructor(
        private nowFrame: number,
        keymap: Map<Keys, number>,
        private readonly options: KeyboardOptions,
        private oldState?: KeyboardState) {

        this.keymap_ = new Map(keymap);
        if (oldState) {
            oldState.oldState = undefined;
        }
    }

    public isDown(key: Keys): boolean {
        return this.keymap_.has(key);
    }
    public isUp(key: Keys): boolean {
        return !this.keymap_.has(key);
    }
    public isPressed(keys: Keys | Keys[]): boolean {
        return keys instanceof Array
            ? this.keyChordPressed(keys)
            : this.keyPressed(keys);
    }
    public isReleased(key: Keys): boolean {
        return this.isDown(key) && !!this.oldState && this.oldState.isUp(key);
    }

    private keyPressed(key: Keys): boolean {
        if (this.oldState && this.isDown(key)) {
            if (this.oldState.isUp(key))
                return true;

            const opt = this.options.repeat;
            if (typeof opt === 'object') {

                const start = this.keymap_.get(key) ?? 0;
                const delta = this.nowFrame - start;

                return delta === 1 || (delta - opt.delayFrames) % opt.periodFrames === 1;
            }
        }
        return false;
    }
    private keyChordPressed(chord: Keys[]): boolean {
        return chord.every(k => this.isDown(k)) && this.isPressed(chord[chord.length - 1]);
    }
}

type KeyboardOptions = {
    repeat: 'none' | 'native' | { delayFrames: number, periodFrames: number }
}

const DEFAULT_OPTIONS: KeyboardOptions = {
    repeat: { delayFrames: 16, periodFrames: 5 }
}

export class Keyboard {
    public Buffer: string[] = [];
    private keymap_ = new Map<Keys, number>();
    private nowFrame_ = 0;
    private state_: KeyboardState;
    private options_: KeyboardOptions;

    public constructor(elem?: HTMLElement, options?: KeyboardOptions) {
        elem = elem ?? document.body;
        this.options_ = options || DEFAULT_OPTIONS;

        elem.addEventListener('keydown', (ev) => this.keydown(ev));
        elem.addEventListener('keyup', (ev) => this.keyup(ev));
        elem.addEventListener('keypress', (ev) => this.keypress(ev));
    }

    public nextState(): KeyboardState {
        this.nowFrame_++;
        this.state_ = new KeyboardState(Math.floor(this.nowFrame_), this.keymap_, this.options_, this.state_);
        return this.state_;
    }

    private keyup(event: KeyboardEvent) {
        this.keymap_.delete(event.code as Keys);
        this.eventHandled(event);
    }
    private keydown(event: KeyboardEvent) {
        if (this.options_.repeat !== 'native') {
            if (!this.keymap_.has(event.code as Keys))
                this.keymap_.set(event.code as Keys, this.nowFrame_);
        } else {
            this.keymap_.set(event.code as Keys, this.nowFrame_);
        }
        this.eventHandled(event);
    }
    private keypress(event: KeyboardEvent) {
        if (isKeyPrintable(event))
            this.Buffer.push(event.key);
        this.eventHandled(event);
    }

    private eventHandled(event: KeyboardEvent) {
        if (event.code !== 'F12' && event.code !== 'F5') {
            event.preventDefault();
        }
    }

}

