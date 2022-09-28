import { assert } from '../utils';
import * as wglt from 'wglt';
import { Terminal } from '../display/Terminal';
import { Color } from './Color';

type BoxOption = 'top' | 'bottom' | 'left' | 'right';

export class WebGLTerminal implements Terminal {

    private term_: wglt.Terminal;
    constructor(readonly canvas: HTMLCanvasElement, private font_?: wglt.Font) {
        assert(canvas && canvas.tagName === 'CANVAS', 'Canvas must be provided.');

        this.font_ = font_ || wglt.DEFAULT_FONT;
        console.log(this.font_);

        this.canvas.style.imageRendering = 'crisp-edges';

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
    }

    /** Width of the console buffer, in characters. */
    get width() { return Math.floor(this.canvas.width / this.font_!.charWidth); }
    /** Height of the console buffer, in characters */
    get height() { return Math.floor(this.canvas.height / this.font_!.charHeight); }

    foreground: Color;
    background: Color;

    cursorX: number = 0;
    cursorY: number = 0;
    private originX_: number = 0;
    private originY_: number = 0;

    get originX() { return this.originX_; }
    get originY() { return this.originY_; }

    get grid() {
        return this.term_.grid;
    }

    clear(bg = this.background): void {
        this.term_.fillRect(0, 0, this.width, this.height, ' ', 0, bg as any);
    }
    resetFormat(): void {
        this.foreground = Color.LightGray;
        this.background = Color.Black;
    }

    frame(dt: number) {
        (this.term_ as any).renderLoop();
    }

    setCursor(x: number, y: number): void {
        this.cursorX = x;
        this.cursorY = y;
    }
    withOrigin(x: number, y: number, callback: () => void): void {
        const oldx = this.originX_, oldy = this.originY_;
        try {
            this.setCursor(x, y);
            this.originX_ = x;
            this.originY_ = y;
            callback();
        } finally {
            this.originX_ = oldx;
            this.originY_ = oldy;
        }
    }
    withFormat(callback: () => void): void {
        const oldfg = this.foreground;
        const oldbg = this.background;
        try {
            callback();
        } finally {
            this.foreground = oldfg;
            this.background = oldbg;
        }
    }


    drawString(x: number, y: number, text: any, fg?: Color, bg?: Color): void {
        text += '';
        this.term_.drawString(x, y, text, fg ?? this.foreground as any, bg ?? this.background as any);
    }
    drawCenteredString(x: number, y: number, text: any, fg?: Color, bg?: Color): void {
        text += '';
        this.drawString(x - Math.ceil(text.length / 2), y, text, fg ?? this.foreground, bg ?? this.background);
    }

    printlnCenter(str: string, width?: number, fg?: Color, bg?: Color): void {
        width = width || this.width;
        this.cursorX += Math.floor((width - str.length) / 2);
        this.println(str, fg, bg);
    }

    println(str?: any, fg?: Color, bg?: Color): void {
        this.print((str || '') + '\n', fg, bg);
    }
    print(str: any, fg?: Color, bg?: Color): void {
        for (let ch of str + '') {

            switch (ch.charCodeAt(0)) {
                case 10:
                    this.cursorY++;
                    this.cursorX = this.originX_;
                    break;
                default:
                    this.drawString(this.cursorX, this.cursorY, ch, fg ?? this.foreground, bg ?? this.background);
                    this.cursorX += 1;
                    break;
            }

            if (this.cursorX >= this.width) { this.cursorX = this.originX_; this.cursorY++; }
            //if (this.cursorY >= this.height) { this.cursorY = this.originY_; }
        }
    }

    drawBox(x: number, y: number, width: number, height: number, options?: BoxOption[], fg?: Color, bg?: Color): void {
        options = options || ['top', 'bottom', 'left', 'right'];
        const top = options.includes('top');
        const bottom = options.includes('bottom');
        const left = options.includes('left');
        const right = options.includes('right');
        this.term_.drawBox(x, y, width, height,
            top ? 196 : 32,
            right ? 179 : 32,
            bottom ? 196 : 32,
            left ? 179 : 32,
            top || left ? 218 : 32,
            top || right ? 191 : 32,
            bottom || left ? 217 : 32,
            bottom || right ? 192 : 32,
            fg || this.foreground as any, bg || this.background as any);
    }

    private onResize() {
        console.log('resized');
        this.canvas.width = this.canvas.parentElement!.clientWidth;
        this.canvas.height = this.canvas.parentElement!.clientHeight;

        this.term_ = new wglt.Terminal(this.canvas, this.width, this.height, {
            font: this.font_,
        });
        (this.term_ as any).handleResize = () => { };
        (this.term_ as any).requestAnimationFrame = () => { };
    }

    drawLineX(x0: number, y0: number, x1: number, y1: number, fg?: Color, bg?: Color): void {

        x0 = Math.floor(x0);
        x1 = Math.floor(x1);
        y0 = Math.floor(y0 * 2);
        y1 = Math.floor(y1 * 2);

        const dx = x1 - x0;
        const dy = y1 - y0;

        // calculate steps required for generating pixels
        const steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

        // calculate increment in x & y for each steps
        const Xinc = dx / steps;
        const Yinc = dy / steps;

        // Put pixel for each step
        var X = x0;
        var Y = y0;
        for (var i = 0; i <= steps; i++) {
            const Xi = Math.floor(X);
            const Yi = Math.floor(Y / 2);
            const upper = Math.floor(Y) % 2;
            const cell = this.term_.getCell(Xi, Yi)!;
            if (cell.charCode > 128 && cell.charCode <= 131) {
                cell.charCode = cell.charCode | (upper + 1);
            } else {
                cell.charCode = 129 + upper;
            }
            cell.setForeground(fg ?? this.foreground as any);
            cell.setBackground(bg ?? this.background as any);
            cell.dirty = true;
            X += Xinc;
            Y += Yinc;
        }
    }

}
