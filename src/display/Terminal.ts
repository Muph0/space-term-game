import { Color } from "../platform/Color";

export type BoxOption = 'top' | 'bottom' | 'left' | 'right';

export interface Terminal {

    /** Width of the console buffer, in characters. */
    get width(): number;
    /** Height of the console buffer, in characters */
    get height(): number;

    foreground: Color;
    background: Color;

    cursorX: number;
    cursorY: number;
    get originX(): number;
    get originY(): number;

    get grid(): { charCode: number }[][];

    clear(bg?: Color): void;
    resetFormat(): void;

    setCursor(x: number, y: number): void;
    withOrigin(x: number, y: number, callback: () => void): void;
    withFormat(callback: () => void): void;

    print(text: any, fg?: Color, bg?: Color): void;
    println(text?: any, fg?: Color, bg?: Color): void;
    printlnCenter(text: any, width: number, fg?: Color, bg?: Color): void;
    drawString(x: number, y: number, str: any, fg?: Color, bg?: Color): void;
    drawCenteredString(x: number, y: number, text: any, fg?: Color, bg?: Color): void;

    drawBox(x: number, y: number, width: number, height: number, options?: BoxOption[], fg?: Color, bg?: Color): void;
    drawLineX(x0: number, y0: number, x1: number, y1: number, fg?: Color, bg?: Color): void;
}

export const CHAR = {
    arrowLeft: String.fromCharCode(27),
    arrowRight: String.fromCharCode(26),
    chevronRight: String.fromCharCode(16),
}
