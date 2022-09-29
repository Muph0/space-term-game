import { Keys } from "../platform/Keyboard";
import { Updatable, UpdateContext } from "../Update";
import { assert } from "../utils";
import { Menu, MenuSettings, unfactorize } from "./Menu";

type MenuItems<T> = Menu<T>['items'];

export interface RecursiveMenuSettings<T> extends MenuSettings<T> {
    enter: Keys | Keys[],
    exit: Keys | Keys[],
    recurse: (item: T) => (() => MenuItems<T>) | MenuItems<T> | undefined,
    onLevelChange: () => any,
}

export class RecursiveMenu<T> implements Updatable {

    public get menus(): ReadonlyArray<Menu<T>> { return this.menuStack_; }
    private menuStack_: Menu<T>[];
    constructor(
        firstLayer: MenuItems<T> | (() => MenuItems<T>),
        private readonly settings: RecursiveMenuSettings<T>
    ) {
        this.menuStack_ = [new Menu(firstLayer, settings)];
    }

    public get selected(): T { return this.top.selected; };
    public get top(): Menu<T> { return this.fromTop(0)!; }
    public fromTop(i: number): Menu<T> | undefined {
        assert(i >= 0, 'Negative index');
        return this.menuStack_[this.menuStack_.length - 1 - i];
    }

    update(ctx: UpdateContext): void {
        const kbs = ctx.kbs;

        if (this.top.isConfirmed(kbs, this.settings.enter)) {
            const nextLevel = this.settings.recurse(this.top.selected);
            if (nextLevel !== undefined && [...unfactorize(nextLevel)].length > 0) {
                this.menuStack_.push(new Menu(nextLevel, this.settings));
                this.settings.onLevelChange();
            }
        }

        if (this.menuStack_.length > 1 && kbs.isPressed(this.settings.exit)) {
            this.menuStack_.pop();
            this.settings.onLevelChange();
        }

        this.top.update(ctx);
    }
}