import { Menu } from "../display/Menu";
import { Game } from '../Game';
import { StationType } from "../model/station/Station";
import { STATIONS } from "../model/station/StationDefinitions";
import { generateNewSystem } from "../model/objects/StarSystem";
import { Color } from '../platform/Color';
import { Keys } from '../platform/Keys';
import { DrawContext, UpdateContext } from '../Update';
import { GameScreen } from "./GameScreen";
import { RootGameScreen } from "./IngameTabs";

export class SelectStationScreen implements GameScreen {

    constructor(private game: Game) { }

    stations = Object.values(STATIONS());

    menu = new Menu(this.stations, {
        next: Keys.ArrowDown,
        prev: Keys.ArrowUp,
        descriptor: s => s.name,
    });

    onShow(): void {
        console.log('showing', this.toString());
    }

    update(ctx: UpdateContext): void {
        const { kbs } = ctx;
        this.menu.update(ctx);

        if (kbs.isPressed(Keys.Enter)) {
            const selectedStation = this.menu.selected;
            const newSystem = generateNewSystem();
            this.game.simulation.newSystem(newSystem);
            this.game.simulation.newStation(selectedStation.create(this.game.simulation));

            const next = new RootGameScreen(this.game);
            this.game.pushScreen(next);
        }

        if (kbs.isPressed(Keys.Escape)) {
            this.game.popScreen(this);
        }
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;
        term.resetFormat();

        this.menu.drawAsMenu(ctx, 1, 1);

        const station = this.stations[this.menu.selectedIndex];
        const maxNameLen = this.menu.menuWidth;

        term.withOrigin(maxNameLen + 10, 1, () => {

            term.print('Hangar capacity: ');
            term.println(station.initHangarcap, Color.DarkCyan);
            term.print('Facility slots: ');
            term.println(station.initModulecap, Color.DarkCyan);
            term.cursorY++;

            const classes = station.facilities.map(f => f.classAndLvl());
            const maxClassW = Math.max(...classes.map(s => s.length));
            const cx = term.cursorX;
            for (let i = 0; i < station.initModulecap; i++) {
                const fac = station.facilities[i];

                if (fac) {
                    term.print(`${classes[i]}:`);
                    term.cursorX = cx + maxClassW + 2;
                    term.print(fac.name);
                    term.println();
                }
            }
        });

        term.drawLineX(5, 20, 39, 26);
        term.drawLineX(3, 22, 45, 23.5);


    }
}
