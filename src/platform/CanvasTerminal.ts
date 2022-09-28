/*
import { assert } from "../utils";
import { CanvasWindow } from "./CanvasWindow";
import { Terminal as ITerminal } from "../display/Terminal";

type Color = [number, number, number];
export const rgb = (r: number, g: number, b: number) => { return `rgb(${r},${g}${b})`; }

const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 16;

type CanvasFillStyle = string | CanvasGradient | CanvasPattern;
type Cell = {
    char: number;
    foreground: CanvasFillStyle;
    background: CanvasFillStyle;
    dirty: boolean;
};

export class CanvasTerminal implements ITerminal {


    // Column number of the cursor, leftmost is zero.
    cursorX: number = 0;
    // Row number of the cursor, top is zero.
    cursorY: number = 0;

    // Width of the console buffer, in characters.
    get width() { return Math.floor(this.window.width / CHAR_WIDTH); }
    // Height of the console buffer, in characters
    get height() { return Math.floor(this.window.height / CHAR_HEIGHT); }

    foreground: Color;
    background: Color;

    readonly window: CanvasWindow;
    private spritefont: CanvasImageSource;
    private context2d: CanvasRenderingContext2D;
    private buffer: Cell[];

    constructor(container: HTMLElement) {
        this.window = new CanvasWindow(container);
        this.window.canvas.style.imageRendering = 'crisp-edges';
        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
        this.resetFormat();
    }

    private onResize() {
        this.context2d = this.window.canvas.getContext('2d');
        this.buffer = [];
        for (var i = 0; i < this.width * this.height; i++) {
            this.buffer[i] = {
                char: CHARSET.indexOf(' '),
                foreground: this.foreground,
                background: this.background,
                dirty: false,
            }
        }
    }

    clear() {
        const ctx = this.context2d;
        ctx.clearRect(0, 0, this.window.width, this.window.height);
        this.cursorX = this.cursorY = 0;
        for (var i = 0; i < this.buffer.length; i++)
            this.buffer[i].dirty = false;
    }

    resetFormat(): void {
        this.foreground = 'lightgray';
        this.background = 'black';
    }

    print(str: string) {
        const [x, y] = this.drawString(this.cursorX, this.cursorY, str + '\n');
        this.cursorX = x;
        this.cursorY = y;
    }

    drawString(x: number, y: number, str: string): [number, number] {
        const w = this.width;
        const h = this.height;

        const cx = x;

        for (let i = 0; i < str.length; i++) {
            const ch = str[i];

            if (x >= w) { y++; x = 0; }
            if (y >= h) y = 0;

            switch (ch.charCodeAt(0)) {
                case 10:
                    x = 0;
                    y++;
                    break;
                default:
                    const cell = this.buffer[x + y * w];

                    cell.dirty = true;
                    cell.char = CHARSET.indexOf(ch);
                    cell.foreground = this.foreground;
                    cell.background = this.background;

                    x++;
                    break;
            }
        }

        if (x >= w) { y++; x = 0; }
        if (y >= h) y = 0;

        return [x, y];
    }

    render() {
        const ctx = this.context2d;
        const w = this.width;
        const h = this.height;


        ctx.globalCompositeOperation = "source-over";
        for (let i = 0; i < this.buffer.length; i++) {
            const cell = this.buffer[i];

            if (cell.dirty) {
                cell.dirty = false;

                const sx = (cell.char % CHARSET_WIDTH) * CHAR_WIDTH;
                const sy = Math.floor(cell.char / CHARSET_WIDTH) * CHAR_HEIGHT;
                const dx = (i % w) * CHAR_WIDTH;
                const dy = Math.floor(i / w) * CHAR_HEIGHT;

                // Draw the character MASK in empty rectangle
                ctx.clearRect(dx, dy, CHAR_WIDTH, CHAR_HEIGHT);
                ctx.drawImage(spritefont, sx, sy, CHAR_WIDTH, CHAR_HEIGHT, dx, dy, CHAR_WIDTH, CHAR_HEIGHT);
            }
        }

        ctx.globalCompositeOperation = "source-atop";
        for (let i = 0; i < this.buffer.length; i++) {
            const cell = this.buffer[i];
            const dx = (i % w) * CHAR_WIDTH;
            const dy = Math.floor(i / w) * CHAR_HEIGHT;
            // Draw fg color on top of the mask
            ctx.fillStyle = cell.foreground;
            ctx.fillRect(dx, dy, CHAR_WIDTH, CHAR_HEIGHT);

        }
        ctx.globalCompositeOperation = "destination-over";
        for (let i = 0; i < this.buffer.length; i++) {
            const cell = this.buffer[i];
            //// fill the rest with bg color
            const dx = (i % w) * CHAR_WIDTH;
            const dy = Math.floor(i / w) * CHAR_HEIGHT;
            ctx.fillStyle = cell.background;
            ctx.fillRect(dx, dy, CHAR_WIDTH, CHAR_HEIGHT);
        }
    }
}

const CHARSET_WIDTH = 32;
const CHARSET
    = "\0☺☻♥♦♣♠•◘○\n♂♀\r♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼"
    + " !\"#$%&'()*+,-./0123456789:;<=>?"
    + "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_"
    + "`abcdefghijklmnopqrstuvwxyz{|}~⌂"
    + "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒ"
    + "áíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐"
    + "└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀"
    + "αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";

export var spritefont: ImageBitmap;


const FONT_DATA = `data:image/png;base64,
iVBORw0KGgoAAAANSUhEUgAAAQAAAACACAMAAADTa0c4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8
YQUAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAOwwAADsMBx2+oZAAADMxJ
REFUeF7tVgli3DgO3Pn/pxeoAwQgyWk7cTKeuLqJOgBSbCWZ3f/985P4nyD75fDLX4Dsl3khX+cFfM6p
7QXgAWHNVzgdXY6fSDb9JHU8gCBLtgoadOUSqmPYbX4Xak8dIuRxOrG1OhPpErLDg7wsSrdiKKlGrP6d
aE9h6zLxgNqVG2sPZD5GTxOyo4OPpSBoM3BlyqJAFhOkAPoQBjSis6++sc5k4MyRuaPxHA+ft0lGg9uc
BSSUF5RoGzSBWW5gIddPnhSLpWmektUNqVNjrW+H7WYKuR5S11Mg3H58AY1HlyYrt/GAJOQi9mqmKLNg
EGBZE6ieYXHHsBuckzl82E16CgdBbKdAgLDG24Yq8DlEgsxKHuewd0fsurohdWoptegNu80Ucj1UXo+B
TZkIkQG7WVKhK2L/wuhmIbdzKFLJpKtuEL4pDGhEJwt4NL9qjznX6UecMvZPr1SQYDvggcxIEUwGOK15
VKc1CGICVnGeqaCkGmxGpXH3qGyjCZJ4EzmlwVMAN8y9B1QsJtIlZI9HUcRcJpiaearCyVFL9QiwveN3
4SN7BnShOkf28dwP3TKAfX3z2495GT99Au9xbiL78zfb+JxTv9AL+CT88hfw1fBlL/6r8MoL+Lp/vC/g
+tvy586f/PAC/hvvpf8I/iK/gFgILv/CbU9KNadeQ2w55/sYejOkrBusiTNnvkNvWGt+dHRQLUsWQXkL
LfrUa/BZKk22nA1KuENRNlc9fATQhqK0ll4A/lToMnB2euNhXZyc0Wk8wKP5nCw1bwVmY0RGGI0UV72y
cUajtF6/QSCb4Z2BVfrYmbCqc9bcBehH8YaaHwIDJ6teoPIo5isU5lNKgsB9x9weDsHZV57COCYVxgMS
6lQul6BBaJm1mONn2ZMx4LEUYDYGnjNuSyXM0XAV9A34aWmN4zymZI5t1FCwNyoBJULmaZgpT/Zck4cH
rqESboW8gR+MAY6WpDKOqzFGbpyBhtHs831auqIQ0Kd0OaIL6/eUF4buJl0GCC16dmC74sLO4Z3RwB0Z
peWga47S5aLiI4AZ99ZljhN8cdLwNAe0KzzYjel1PjmPJldOteYYZx05AqPZ3jma26jfxDr4vfjJ7Z+M
3/AC/t34L/+2l/D9AsR/Lf7GFzB+81/4Aub/XOp/eKWzlCfbgkOZTx+yvIWbTlHhj1Ft4uodSD+yF8cZ
IgpFVJzfQoWW0Gsl7cwriUXVIosXLC6H5TzpTi+fKP/EXuVZVInUrQXgPu5cdL4/eQaH3aelQbWI0npB
AHj0tJ49XPnNFy15KghostDvxAkt+ETP5JPdB9M4qqz1goDG6mltzwCoVpbNWbJCH9WJHDjqgHdBgUNC
4oAy5vRg99MyqYhipUF4CL5k9tKBpodIaq0sjctw7uyDbSxRSUd2sTNLMqbga+Jk8slJOZ8tFlWL2RvZ
2AfBlr2i1jqlcRmO0alOMQYmeJdooGmBEO2RlU8FW3foUYkKzl0vTKHIHkZ91SqxSED5MZf3dBrAHBg0
4B6bWW5W0sgS0rDMSg6h5cw8dEK/56Z3pIpSiJM32UJAsiWFfNI4CBaDZFuw+tlF0v5kPd8IedrUCos1
kTUJSAUrwY64PP54McMxag6wQsgT2x/cRH8Otzf8ZPyrXsDvRP59AOT/Wny/APFfi3gBf/c/g+8XkKu/
gZv/Lq5o2uaGOvnNie/Dh7frya48J7nd6Hp4axojmvt7c6q7/EP48HZvHBxl/IlcD+9dYURptr/DyZ8m
XsSHt3vjZgP2ZPFemDTugT1DeGgRAwLKS3WMK9ie5vhkEOewLKyvrA2cvGOBUyNjwsOst++nK9PTVRNq
KgDlvhwdveWVwUi7oJaNtbV901kHRuRZWXS1sZqMvTSgRsmTqRNgZg+Ocm6XRmH3K0un4MQW+XXgmEX1
mQGYKJVl4BANdZzbW1R2muoElCkApXUOo7D7ygi9glOrHyu/Dhy3krDYDHi0sgwcouEB5fYU0OfJzNw5
WcujjMMcxvI55igiF35po1IDbjvgEALVKwMcj73ySDDCfHDPWQl5Cnfkdy7ZF3I2CMcyTakyqJoChoky
QNaTx2zchq8gj7s98rHxgDb7nm13+Mj+jz+y3vPGY+MWbfp9Gxdy80d2f/yJ/xF8vwDxX4s/+ALq3+xP
/Mv/edw+Wzeavbrm5T82D3MFJj40KUus0bhi5jUmsbbBRjFXDeqT+d9K+1ShmXghFyWf/HSlhOc5Sp4/
us4r6Mj501+FbYmqUTb3Wpk0vFwlIk26TXcSElkI55kacJ0N1mDSA2IKg2Jr18p6S4WxoTeVpbj/TpJ2
MXkf9IB3w9t8PyA49VnvRjujRAUJPAZVCXg4J8VsPLEXg80pkjZHhWishcA2/R3frSybKZIklLB0r3ay
F0vRPfeZKJurLnYpA5FgmBfOSyF+4L2ybKaQJte5iMqj3w8GJDx4y1iwN6yJC7uU8Ti432POdd4ry+ax
CLfwnPIgpEyQqvvWynr0lQO3rdyVG83uItJQxS3svFeWzVmOllVfEdvs0FUzys72SpSOsrnqYpcyWjeR
8wv3FaV+QMuiWDo8LVr5o6Kyiz3d33JCHnYzxJU10xiwRi4PuuNYhxPVICl2uryLZCoF70Qd/MfxkXvE
Hr2A84a+Jj56fW37yj/9l+D7BYj/HPIGseLfIj74q8m/nv6rvRh9qAnnu3/JZ1f8Y/BiMr8UuJ0/eEqq
c9HFmICacL77l3x2czmQsJ+DuR1BkDnpAW6+OZTIfqw4Hh8cy6P3EWL0oSac7/4ln93mJezLzgNtK+7N
A6etez8YOZY+MYSV2TpCjAmoCee7f8ln91gJ+2Px5wErYQ1W3Rgzbw5yxSQ+MZWbkGp+MfpQE853/5LP
rviH6G/B93trs8e9DsLVlwGWPshTnW2LMQE14Xz3L/nshlUgTh+iLXkoTE7chtzXmJJ1NLTC4RNhNjQB
yDCEdSfgHCTFL3Cf50YBWonHPHsCeG0dXNuqb3Z+mAIjtlSI/UGaSvNXxgSUcBxU6w+u3CmAxynxWM1W
QF+DA8pGK42D0toeZTJXOHxyDAsTsBfODry55dim3EzZeJ6HLQkFLJVLkDKY8Mxo0dfZ9SjMoKMvgKY/
yFNhEFiMicZPufkRmoqqOQUslUuUXnA+WukP65eLNtDKLz85hpUKA5vRb/yUmx/BqaDaUCRGrqUsyoLn
b8C8Bh7HsPSJIazMNL8YE42fcvMjOEX9KTiPf+siukXcFp+YzYsj1a7F6Dd+ys2P4BT1ZyB+hS/wg4tg
6YNrpzq7FmOi8VNufgSnqP8gdIu4LT5xrbw4Ul1uMfqNn3LzIzhF/UfBe+iDa6fSBa+MicZPufkRnLJo
bDx5cRCU2XjZK919Y89tXPpjLt4iIAsvWT0A3jnZePLiICiz8bJXuvvGntu49Mecfl5FWxfgnZONJy8O
gjIbL3ulu2/suY1Lf8zp51W0dQHeOdl48uIgKLPxsle6+8ae27j0x5x+XkVbF+Cdk40nLw6CMhsve6W7
b+y5jUt/zOnnVbR1Ad452Xjy4iAos/GyV7r7xp7buPTHnH5eRVsX4J2TjSevfbGQgOGNJj03cNOviI9I
MIdgbhbYRxhgcKC4oq0L8M7JxpMXB0Gt+IKn3PA5G5W7u6be7uvnVbR1YXvjR3lSKo/Zd7h/l/8I51yK
/txHxJDn7sA2ByTxf4Q2zkFkY+VBY+LJP+UXKH21X3PKC+pewTZ7kt8vYO0F3L09+HDQmHjyT/kFSl/t
15zygrpXsM2e5PcLWHsBd28PPhw0Jp78U36B0lf7Nae8oO4VbLMn+f0C1l7A3duDDweNiSf/lF+g9NV+
zSkvqHsF2+xJ3r6Afyv2D/0l+H4B4q+AhxfQ/j4v5F/1aLL/MHYJuenE219QfU+Z0aEqjMEHnG47iAS3
EOl9QxvUfxq7ZN5kbH8DdqN6toIND1Djd4HmhhuG3Dnh7g28i/37qRPqHmdTDxqcZRO9NnYiTx7kWCZK
25xRjqJbaAdun+env4HaxYCuYWQXEx6qZmkl2BhSC9/sHD84IY19/dt60IDmpHuvp4UwNf4E9DFIjfH2
mEQaBMg1qI41qGzWo8pzv4ZU5PEdklvGPu86YtkTe37jkiKIkly7ShBp4F2qWbrqsauRC+Ze48vH0nmb
tWD3Iybq5oUxd20LuolRcy7VHI3WOgcUpYCR6DqWB8za5bJxwjXqxvE1eYO2YUDXMNIgQA6uDjQ8NaRq
wqpyiMYUQmkKz/C5be6KM9r8j/Fw7HocbpBHOqymMsxLOBeo3NdA1lI16mEAuUaYBHI6IeGALQ0kvQMv
7aiRV49/9zV+Hp/6yHP27/9hr+I3vYB/L75fwOdd8p9//g/RFGDcbT073AAAAABJRU5ErkJggg==`
    .replace(/\n/g, '');


export const spritefontPromise = new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => {
        createImageBitmap(img).then(bitmap => {
            spritefont = bitmap;
            resolve(bitmap);
        });
    };
    img.src = FONT_DATA;
});
//*/