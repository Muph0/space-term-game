import { Game } from '../Game';
import { Keys } from '../platform/Keys';
import { DrawContext, UpdateContext } from '../Update';
import { GameScreen } from './GameScreen';
import '../utils/Text';
import { Menu } from '../display/Menu';
import { SystemOverviewScreen } from './SystemOverview';
import { FacilitiesScreen } from './FacilitiesScreen';
import { HangarScreen } from './HangarScreen';
import { ShipsScreen } from './ShipsScreen';

export class RootGameScreen implements GameScreen {

    readonly tabs: GameScreen[];

    get currentScreen() { return this.tabs[this.menu_.selectedIndex]; }

    constructor(private game: Game) {
        this.tabs = [
            new FacilitiesScreen(game),
            new SystemOverviewScreen(game),
            new ShipsScreen(game),
        ];
    }

    private menu_ = new Menu(() => this.tabs, {
        next: Keys.Tab,
        prev: [Keys.ShiftLeft, Keys.Tab]
    });

    onShow(): void {
        this.currentScreen.onShow();
    }

    update(ctx: UpdateContext): void {
        const oldScreen = this.currentScreen;
        this.menu_.update(ctx);

        const tabHotkeys = [Keys.Digit1, Keys.Digit2, Keys.Digit3];
        for (let hk of tabHotkeys) {
            if (ctx.kbs.isPressed(hk)) {
                this.menu_.selectedIndex = tabHotkeys.indexOf(hk);
            }
        }

        if (this.currentScreen !== oldScreen) this.currentScreen.onShow();
        this.currentScreen.update(ctx);
    }

    draw(ctx: DrawContext): void {
        const { term } = ctx;

        term.withOrigin(1, 3, () => {
            this.currentScreen?.draw(ctx);
        });

        this.menu_.drawAsTabs(ctx, 0, 1, ctx.term.width);
    }
}

