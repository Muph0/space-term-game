import { Terminal } from "../../../display/Terminal";
import { Color } from "../../../platform/Color";
import { assert } from "../../../utils";
import { Inventory, InventoryItem } from "../../../utils/Inventory";

export class ShipModule implements InventoryItem<ShipModule> {

    constructor(
        public type: ShipModuleType,
        public level: number,
    ) { }

    readonly in: Inventory<ShipModule> | undefined;
    get itemSize(): number { return 1; }

    readonly iconText = this.type.icon.char + this.level.toString(36).toLowerCase();

    printIcon(term: Terminal) {
        const icon = this.type.icon;
        term.print(this.iconText, icon.fg, icon.bg);
    }
}

type ModuleIcon = {
    char: string;
    fg?: Color;
    bg?: Color;
}

export class ShipModuleType {
    constructor(
        readonly name: string,
        readonly icon: ModuleIcon,
    ) {
        assert(icon.char.length === 1);
    }

    create(level: number = 1) {
        return new ShipModule(this, level);
    }

    prep(level: number) {
        return new PreDressedModule(this, level);
    }
}

export class PreDressedModule {
    constructor(
        readonly type: ShipModuleType,
        readonly level: number,
    ) {
        assert(level > 0);
    }

    create() {
        return this.type.create(this.level);
    }
}

export type MODULES = typeof MODULES;
export const MODULES = {
    miningLaser: new ShipModuleType('Mining laser', { char: 'M', fg: Color.DarkRed }),
    spectrometer: new ShipModuleType('Material spectrometer', { char: 'S', fg: Color.DarkMagenta }),
    radar: new ShipModuleType('Radar probe', { char: 'R', fg: Color.DarkMagenta }),
    cargo: new ShipModuleType('Cargo bay', {char: 'C', bg: Color.DarkGreen }),
};
