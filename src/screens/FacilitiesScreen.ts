import { Menu } from "../display/Menu";
import { CHAR } from "../display/Terminal";
import { Game } from "../Game";
import { Facility } from "../model/facility";
import { Resource } from "../model/Resource";
import { Station } from "../model/station/Station";
import { Color } from "../platform/Color";
import { Keys } from "../platform/Keyboard";
import { DrawContext, UpdateContext } from "../Update";
import { amountWithUnitSI, UI } from "../utils";
import { GameScreen } from "./GameScreen";

export class FacilitiesScreen implements GameScreen {

    readonly name = 'Station';
    private readonly station: Station;
    private readonly menu: Menu<Facility>;

    get selectedFacility() { return this.station.facilts[this.menu.selectedIndex]; }

    constructor(
        private readonly game: Game,
    ) {
        this.station = game.simulation.station;
        this.menu = new Menu(this.station.facilts, {
            next: Keys.ArrowDown,
            prev: Keys.ArrowUp,
        });
        this.menu.descriptor = f => f ? f.type.classAndLvl() : '<empty slot>';
    }

    onShow(): void {
        console.log('showing', this);
    }

    update(ctx: UpdateContext): void {
        const { kbs } = ctx;
        this.menu.update(ctx);

        if (this.selectedFacility) {
            const fac = this.selectedFacility;
            if (kbs.isPressed(Keys.ArrowRight)) {
                fac.powerLevel = Math.min(fac.maxPowerLevel, fac.powerLevel + 1);
            }
            if (kbs.isPressed(Keys.ArrowLeft)) {
                fac.powerLevel = Math.max(0, fac.powerLevel - 1);
            }
        }
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;

        const maxLen = Math.max(...Resource.All.map(r => r.name.length));
        const cx = term.cursorX;
        for (let r of Resource.All) {
            const supply = this.game.simulation.getSupplyOf(r);
            const fract = supply.inStorage / supply.capacity;
            r.printName(term);
            term.print(': ');
            term.cursorX = cx + maxLen + 3;
            term.print('[');
            const inStorage = supply.inStorageAmount;
            const capacity = supply.capacityAmount;
            const delta = amountWithUnitSI(supply.deltaPerSec);
            const label = inStorage.toString() + '/'
                + capacity.toString()
                + ' (' + (delta.amount >= 0 ? '+' : '')
                + delta.amount.toFixed(0) + delta.unit + ')';
            UI.printProgressBar(term, fract, term.width - 4 - term.cursorX,
                label, Color.Orange, Color.Black, Color.DarkGray);
            term.println(']');
        }

        const ry = ++term.cursorY;
        term.println('Station facilites:');

        var maxw = 0;
        this.menu.drawAsMenu(ctx, term.cursorX, term.cursorY + 1, i => {
            const fac = this.station.facilts[i];
            const sel = (i === this.menu.selectedIndex);
            if (fac) {
                const hl = sel ? Color.White : term.foreground;
                term.cursorX++;
                term.print('[', hl);
                UI.printDiscreteBar(term, fac.powerLevel, fac.maxPowerLevel, Color.LightGreen, Color.DarkRed);
                term.print(']', hl);
            }
            maxw = Math.max(maxw, term.cursorX);
        });

        if (this.selectedFacility)
            term.withOrigin(maxw + 5, ry + 1, () => {
                UI.printUnderlined(term, ' ' + this.selectedFacility.type.name + ' ');
                this.selectedFacility.printInfo(ctx);
                term.println();
                term.println(`${CHAR.arrowLeft} ${CHAR.arrowRight} to divert power.`, Color.DarkGray);
                term.println("<ENTER> for more options.", Color.DarkGray);
            });
    }
}