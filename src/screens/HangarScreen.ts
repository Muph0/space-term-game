import { Menu } from "../display/Menu";
import { MenuController } from "../display/MenuController";
import { Game } from "../Game";
import { Ship } from "../model/ship/Ship";
import { Station } from "../model/station/Station";
import { Color } from "../platform/Color";
import { Keys } from "../platform/Keys";
import { UpdateContext, DrawContext } from "../Update";
import { Container } from "../utils/Inventory";
import { DeployShipScreen } from "./DeployShipScreen";
import { GameScreen } from "./GameScreen";


export class HangarScreen implements GameScreen {

    private menuVertical_ = new MenuController(1, Keys.ArrowDown, Keys.ArrowUp);
    private menuHorizontal_ = new MenuController(1, Keys.ArrowRight, Keys.ArrowLeft);

    get allShips() { return [...this.hangar].sort((a,b) => a.name < b.name ? -1 : 0); }
    get selectedShip() { return this.allShips[this.menuVertical_.selectedIndex]; }

    constructor(
        readonly game: Game,
        readonly hangar: Container<Ship, Station>,
    ) { }

    onShow(): void {
        console.log('showing', this.toString());
    }

    update(ctx: UpdateContext): void {
        this.menuVertical_.itemCount = this.allShips.length;

        if (ctx.kbs.isPressed(Keys.Enter)) {
            this.game.pushScreen(new DeployShipScreen(this.game, this.selectedShip));
        }

        this.menuVertical_.update(ctx);
        this.menuHorizontal_.itemCount = this.selectedShip.modules.capacity;
        this.menuHorizontal_.update(ctx);
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;

        const ships = this.game.simulation.getAllShips();
        const longestShipName = Math.max(...ships.map(s => s.name.length))

        term.println('Ships in station hangar:');
        term.cursorY++;

        for (let y = 0; y < ships.length; y++) {
            const selectedRow = y === this.menuVertical_.selectedIndex;
            const ship = ships[y];

            term.print(selectedRow ? Menu.CHEVRON : ' ', Color.White);
            term.cursorX++;
            term.print(ship.name);

            for (let i of ship.modules.slots) {
                const module = ship.modules.get(i);
                const selected = selectedRow && this.menuHorizontal_.selectedIndex === i;
                term.print(' [  ]', selected ? Color.White : term.foreground);
                if (module) {
                    term.cursorX += -module.iconText.length - 1;
                    module.printIcon(term);
                    term.cursorX += 1;
                }
            }

            term.println();
            term.resetFormat();
        }
    }

}