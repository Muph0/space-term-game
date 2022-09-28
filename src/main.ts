import { Keyboard } from "./platform/Keyboard";
import { WebGLTerminal } from "./platform/WebGLTerminal";
import { FIXEDSYS } from "./platform/Font";
import { Game } from "./Game";
import { DrawContext, TimeContext, UpdateContext } from "./Update";
import { Mathx, Mutable } from "./utils";
import { Color } from "./platform/Color";
import './utils/Text';

export const loaded = true;

(async () => {
    console.log('Game starting');

    const canvas = document.querySelector('.container canvas') as HTMLCanvasElement;
    const keyboard = new Keyboard(canvas, { repeat: { delayFrames: 14, periodFrames: 6 } });
    const term = new WebGLTerminal(canvas, FIXEDSYS);
    const game = new Game();

    const timing: Mutable<TimeContext> = {
        dt: 0, seconds: 0, frameNumber: 0, fps: 0
    };
    const updateCtx: Mutable<UpdateContext> = {
        kbs: keyboard.nextState(), time: timing, game
    };
    const drawCtx: DrawContext = {
        term, time: timing
    };

    var lastTime = 0;
    function frame(time: number) {
        canvas.focus();
        time = lastTime + 0.01666666666666;

        // compute frame constants
        timing.seconds = time;
        timing.dt = time - lastTime;
        timing.fps = Mathx.lerp(timing.fps, 1 / timing.dt, 0.05);
        updateCtx.kbs = keyboard.nextState();

        term.clear();
        term.setCursor(0, 0);

        // actual game frame
        game.frame(updateCtx, drawCtx);

        term.drawString(0, term.height - 2, `${timing.seconds.toFixed(3)} s`, Color.Yellow, Color.DarkBlue);
        term.drawString(0, term.height - 1, `${timing.fps.toFixed(1)} fps`, Color.Yellow, Color.DarkBlue);
        term.frame(time);

        lastTime = time;
        timing.frameNumber++;
        requestAnimationFrame(frame);
    }

    const nextFrame = () => new Promise<number>(requestAnimationFrame)

    frame(0.78);
})();
