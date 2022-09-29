import { Color } from '../platform/Color';
import { Keys } from '../platform/Keyboard';
import { Describable, DrawContext, UpdateContext } from '../Update';
import { UI } from '../utils';
import { MenuController } from './MenuController';
import { CHAR } from './Terminal';

export type MenuSettings<T> = {
    next: Keys | Keys[],
    prev?: Keys | Keys[],
    descriptor?: (item: T) => string,
    selectColor?: Color,
    wrap?: boolean,
};

type MenuItems<T> = T[];

export function unfactorize<T>(value: MenuItems<T> | (() => MenuItems<T>)): MenuItems<T> {
    if (value instanceof Function) {
        return value();
    } else {
        return value;
    }
}

export class Menu<T> extends MenuController {

    static readonly CHEVRON = CHAR.chevronRight;
    public focusColor = Color.White;
    public descriptor = (item: T) => (item as any as Describable).name ?? item + '';
    get items(): MenuItems<T> { return unfactorize(this.items_); }
    set items(v: MenuItems<T> | (() => MenuItems<T>)) { this.items_ = v; }

    constructor(
        private items_: MenuItems<T> | (() => MenuItems<T>),
        settings: MenuSettings<T>,
    ) {
        super(1, settings.next, settings.prev ?? [], settings.wrap ?? true);
        if (settings.descriptor !== undefined) this.descriptor = settings.descriptor;
        if (settings.selectColor !== undefined) this.focusColor = settings.selectColor;
        if (settings.wrap !== undefined) this.wrap = settings.wrap;
    }

    declare readonly itemCount: number;
    private itemsEnumerated_: T[];
    private enumerateItems() { return this.itemsEnumerated_ = [...this.items]; }
    private itemNames_: string[] = [];
    get selected(): T { return (this.itemsEnumerated_ ?? this.enumerateItems())[this.selectedIndex]; }
    get menuWidth() { return 2 + Math.max(...this.itemNames_.map(n => n.length)); }

    update(ctx: UpdateContext): void {
        const oldSelected = this.selected;
        const oldIndex = this.selectedIndex;

        this.enumerateItems();
        this.itemNames_ = this.itemsEnumerated_.map(this.descriptor);
        super.itemCount = this.itemsEnumerated_.length;
        super.update(ctx);

        if (oldSelected) {
            const newIndex = this.itemsEnumerated_.indexOf(oldSelected);
            if (newIndex >= 0 && newIndex !== oldIndex)
                super.selectedIndex = newIndex;
        }
    }

    drawAsMenu({ term }: DrawContext, x = term.cursorX, y = term.cursorY, beforeLineFinished?: (i: number) => void): void {
        term.setCursor(x, y);
        UI.printMenu(term, this.selectedIndex, this.itemNames_, this.focusColor, beforeLineFinished);
    }

    drawAsTabs({ term }: DrawContext, x: number, y: number, width: number): void {
        term.setCursor(x, y);
        UI.printTabs(term, this.selectedIndex, this.itemNames_, width, this.focusColor);
    }
}