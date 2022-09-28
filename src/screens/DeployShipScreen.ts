import { Menu } from "../display/Menu";
import { Game } from "../Game";
import { ResourceHarvestFeature } from "../model/objects/ObjectFeatures";
import { AstroObject } from "../model/objects/SpaceObject";
import { Ship } from "../model/ship/Ship";
import { ShipMiningJob } from "../model/ship/ShipJob";
import { Color } from "../platform/Color";
import { Keys } from "../platform/Keys";
import { DrawContext, UpdateContext } from "../Update";
import { GameScreen } from "./GameScreen";


export class DeployShipScreen implements GameScreen {

    constructor(
        readonly game: Game,
        readonly ship: Ship,
    ) { }

    private readonly menu = new Menu(
        [...this.game.simulation.system.
            findAllChildren(o => o instanceof AstroObject
                && o.hasFeature(ResourceHarvestFeature))] as AstroObject[], {
        next: Keys.ArrowDown,
        prev: Keys.ArrowUp,
    });

    onShow(): void {
        console.log('showing', this.toString());
    }

    update(ctx: UpdateContext): void {
        this.menu.update(ctx);

        if (ctx.kbs.isPressed(Keys.Escape)) {
            this.game.popScreen(this);
        }

        if (this.menu.isConfirmed(ctx.kbs, Keys.Enter)) {
            this.ship.job = new ShipMiningJob(this.ship, this.menu.selected.features.getRequired(ResourceHarvestFeature));
            this.game.popScreen(this);
        }
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;

        term.print('Deploy ');
        term.print(this.ship.name, Color.Orange)
        term.println(' to:');
        this.menu.drawAsMenu(ctx);
    }
}