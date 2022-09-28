import { Menu } from "../display/Menu";
import { CHAR, Terminal } from "../display/Terminal";
import { ResourceAmount } from "../model/Resource";
import { Color } from "../platform/Color";
import { DrawContext, UpdateContext } from "../Update";
import { Mathx } from "./Mathx";
import { breakLines } from "./Text";
import { Pos2 } from "./Vec";

export function printSlots(term: Terminal, boxw: number, boxh: number, count: number, spacing: number, callback: (i: number) => void): void {
    let cx = term.cursorX;
    let cy = term.cursorY;

    for (let i = 0; i < count; i++) {
        term.drawBox(cx, cy, boxw, boxh, ['left', 'right']);
        term.withOrigin(cx + 1, cy + 1, () => {
            callback(i);
        });

        cx += boxw + 1;
        if (cx >= term.width - boxw) {
            cx = term.originX;
            cy += boxh;
        }
    }
}

export function printTabs(term: Terminal, selected: number, items: string[], width: number, hl?: Color) {
    let cx = term.cursorX;
    let cy = term.cursorY;

    const step = Math.floor(width / items.length);
    const pad = Math.floor(step / 2);

    hl = hl ?? Color.White;

    for (let i = 0; i < items.length; i++) {
        const x = cx + pad + i * step;
        if (i === selected) {
            const msg = items[i].toLocaleUpperCase();
            const offset = Math.floor(msg.length / 2)
            term.drawCenteredString(x - offset - 2, cy, `${CHAR.arrowLeft}`, Color.DarkGray);
            term.drawCenteredString(x, cy, msg, hl);
            term.drawCenteredString(x + offset + 4, cy, `tab ${CHAR.arrowRight}`, Color.DarkGray);
        } else {
            term.drawCenteredString(x, cy, items[i]);
        }
    }
    term.cursorY++;
}

export function printMenu(term: Terminal, selected: number, items: string[], hl?: Color, beforeLineFinished?: (i: number) => void) {

    term.withOrigin(term.cursorX, term.cursorY, () => {
        for (let i = 0; i < items.length; i++) {
            if (i === selected) {
                term.print(Menu.CHEVRON + ' ' + items[i], hl);
            } else {
                term.print('  ' + items[i]);
            }
            if (beforeLineFinished)
                beforeLineFinished(i);
            term.println();
        }
    });
}

export function printProgressBar(term: Terminal, completed: number, width: number, label = '', color?: Color, fg?: Color, bg?: Color) {
    color = color ?? Color.DarkGray;
    bg = bg ?? term.background;

    for (let i = 0; i < width; i++) {
        const stri = Math.floor(i - (width - label.length) / 2);
        const blend = Mathx.clamp(0, 1, completed * width - i);
        term.print(stri >= 0 && stri < label.length ? label[stri] : ' ', fg, Color.blend(bg, color, blend));
    }
}

export function printDiscreteBar(term: Terminal, amount: number, count: number, color?: Color, fg?: Color, bg?: Color) {
    for (var i = 0; i < count; i++) {
        //if (i > 0) term.print(' ');
        if (i < amount)
            //term.print(String.fromCharCode(219), color, bg);
            term.print(String.fromCharCode(254), color, bg);
        else
            term.print(String.fromCharCode(249), fg, bg);
    }
}

export function printCommaList<T>(term: Terminal, list: Iterable<T>, callback: (x: T) => any) {
    var first = true;
    for (let x of list) {
        if (!first)
            term.print(', ');
        callback(x);
        first = false;
    }
}

export function printlnResourceList(term: Terminal, label: string, list: ResourceAmount[], fg?: Color, bg?: Color) {
    if (list.length > 0) {
        term.print(label, fg, bg);
        printCommaList(term, list, amt => amt.print(term, true));
        term.println('.');
    }
}

export function printUnderlined(term: Terminal, str: string) {
    term.println(str);
    term.println(new Array(str.length + 1).fill('').join(String.fromCharCode(205)));
}

export function printEfficiencySentence(term: Terminal, efficiency: number) {
    term.println(`Now operating at ${(efficiency * 100).toFixed(0)}% capacity.`)
}

export function printLines(term: Terminal, text: string, spaceLeft: number, justify = true) {
    const lines = breakLines(text, spaceLeft);
    for (let line of lines) {
        const last = line === lines[lines.length - 1];
        if (justify && line.length > 1 && !last) {
            const spacesInLine = spaceLeft - line.map(w => w.length).reduce((a, b) => a + b);
            const spacesAfterWord = Math.floor(spacesInLine / (line.length - 1));
            const extraSpaces = spacesInLine - spacesAfterWord * (line.length - 1);

            for (let i = 0; i < line.length; i++) {
                const word = line[i];
                term.print(word);
                if (i < line.length - 1)
                    term.print(' '.repeat(spacesAfterWord + (i < extraSpaces ? 1 : 0)));
            }
            term.println();
        } else {
            term.println(line.join(' '));
        }
    }
}


export function column<T>(term: Terminal, headline: string, x: number, y: number, iter: Iterable<T>, callback: (t: T) => void): number {
    let maxX = 0;
    term.withOrigin(x, y + 1, () => {
        for (let it of iter) {
            callback(it);
            maxX = Math.max(term.cursorX, maxX);
            term.println();
        }
    });
    term.drawCenteredString((x + maxX) / 2, y, headline, Color.DarkGray);
    return maxX;
}

export function fillCircle(term: Terminal, pos: Pos2, radius: number) {
    // TODO: circle algorithm
    term.drawString(pos.x, pos.y, '+');
}

export function showScreenColorTest(ctx: DrawContext) {
    const term = ctx.term;
    term.setCursor(0, 0);
    term.foreground = Color.Black;
    for (let y = 0; y < term.width; y++)
        for (let x = 0; x < term.width; x++) {
            const b = .5 + .5 * Math.sin(ctx.time.seconds)
            const color = Color.fromRgb(
                x / term.width * 255, y / term.height * 255, b * 255);
            const msg = ' NO SCREEN TO SHOW ';
            const i = Mathx.clamp(0, msg.length - 1, x - ((term.width - msg.length) >> 1));

            term.drawString(x, y, y === term.height >> 1 ? msg[i] : ' ', Color.Black, color);
        }
    term.resetFormat();
}
