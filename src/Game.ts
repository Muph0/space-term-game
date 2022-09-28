import { GameScreen, SelectStationScreen } from "./screens";
import { Simulation } from "./Simulation";
import { DrawContext, UpdateContext } from "./Update";
import { assert, UI } from "./utils";


export class Game {

    /**
     * Get the currently displayed screen == screen on top of the stack.
     */
    private get currentScreen() { return this.screenStack[this.screenStack.length - 1]; };

    /**
     * UI states are managed by screens. Here is a stack of them, the screen that is currently
     * on top of the stack is the one which is receiving update() and draw() calls.
     *
     * Further screen hierarchy managed by a particular screen is also possible, @see RootGameScreen
     */
    private screenStack: GameScreen[] = [];

    /**
     * The game simulation - takes care of updating the game universe state.
     */
    readonly simulation: Simulation;

    public readonly screens: GameScreen[] = [];

    constructor() {
        this.pushScreen(new SelectStationScreen(this));
        this.simulation = new Simulation();
    }

    pushScreen(screen: GameScreen) {
        this.screenStack.push(screen);
        this.currentScreen.onShow();
    }
    popScreen(currentScreen: GameScreen) {
        assert(currentScreen === this.currentScreen);
        this.screenStack.pop();
        this.currentScreen?.onShow();
    }

    frame(update: UpdateContext, draw: DrawContext): void {
        const screen = this.currentScreen;
        this.simulation.update(update);

        if (screen !== undefined) {
            screen.update(update);
            screen.draw(draw);
        } else {
            UI.showScreenColorTest(draw);
        }
    }

}