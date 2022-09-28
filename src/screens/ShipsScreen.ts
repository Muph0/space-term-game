import { Menu } from '../display/Menu';
import { MenuController } from '../display/MenuController';
import { Game } from '../Game';
import { Ship } from '../model/ship/Ship';
import { Color } from '../platform/Color';
import { Keys } from '../platform/Keys';
import { UpdateContext, DrawContext } from '../Update';
import { UI } from '../utils';
import { DeployShipScreen } from './DeployShipScreen';
import { GameScreen } from './GameScreen';


export class ShipsScreen implements GameScreen {

    readonly name = 'Ships';
    constructor(readonly game: Game) { }

    private menu = new Menu(this.game.simulation.system.ships, {
        next: Keys.ArrowDown,
        prev: Keys.ArrowUp,
        descriptor: sh => sh.name,
    });

    onShow(): void {
        console.log('showing', this.toString());
    }

    update(ctx: UpdateContext): void {
        if (ctx.kbs.isPressed(Keys.Enter)) {
            this.game.pushScreen(new DeployShipScreen(this.game, this.menu.selected));
        }

        this.menu.update(ctx);
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;

        term.println('All ships in reach:');
        let x = 1;
        let y = term.cursorY + 1;

        x = UI.column(term, 'NAME', x, y, this.menu.items, ship => {
            const sel = this.menu.selected === ship;
            const color = sel ? Color.White : term.foreground;
            term.print(sel ? Menu.CHEVRON : ' ', color);
            term.cursorX++;
            term.print(ship.name, color);
        });

        x = UI.column(term, 'JOB', x + 1, y, this.menu.items, ship => {
            const sel = this.menu.selected === ship;
            term.print(ship.jobName);
        });
    }
}