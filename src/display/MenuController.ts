import { KeyboardState, Keys } from '../platform/Keyboard';
import { Updatable, UpdateContext } from '../Update';
import { assert, Mathx } from '../utils';

export class MenuController implements Updatable {

    selectedIndex: number = 0;

    private readonly nextKeys: Keys[];
    private readonly prevKeys?: Keys[];

    constructor(
        public itemCount: number,
        next: Keys | Keys[],
        prev?: Keys | Keys[],
        public wrap = true,
    ) {
        this.prevKeys = prev && (prev instanceof Array ? [...prev] : [prev]);
        this.nextKeys = next instanceof Array ? [...next] : [next];
    }

    private changed_ = false;
    get changed() { return this.changed_; }

    update({ kbs }: UpdateContext) {
        assert(Number.isInteger(this.selectedIndex));
        const oldIndex = this.selectedIndex;
        if (this.itemCount === 0) return;

        if (this.prevKeys && kbs.isPressed(this.prevKeys))
            this.selectedIndex--;
        else if (kbs.isPressed(this.nextKeys))
            this.selectedIndex++;

        if (this.wrap)
            this.selectedIndex = ((this.selectedIndex % this.itemCount) + this.itemCount) % this.itemCount;
        else
            this.selectedIndex = Mathx.clamp(0, this.itemCount - 1, this.selectedIndex);

        if (oldIndex !== this.selectedIndex) this.changed_ = true;
    }

    isConfirmed(kbs: KeyboardState, keys: Keys | Keys[]) {
        return this.itemCount > 0 && kbs.isPressed(keys);
    }
}