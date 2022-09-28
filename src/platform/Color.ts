import * as wglt from 'wglt';

export type Color = { readonly __opaque: Color };


export const Color = {
    Black: wglt.Colors.BLACK as any as Color,
    White: wglt.Colors.WHITE as any as Color,
    LightGray: wglt.Colors.LIGHT_GRAY as any as Color,
    DarkGray: wglt.Colors.DARK_GRAY as any as Color,
    Yellow: wglt.Colors.YELLOW as any as Color,
    Brown: wglt.Colors.BROWN as any as Color,
    LightRed: wglt.Colors.LIGHT_RED as any as Color,
    DarkRed: wglt.Colors.DARK_RED as any as Color,
    LightGreen: wglt.Colors.LIGHT_GREEN as any as Color,
    DarkGreen: wglt.Colors.DARK_GREEN as any as Color,
    LightCyan: wglt.Colors.LIGHT_CYAN as any as Color,
    DarkCyan: wglt.Colors.DARK_CYAN as any as Color,
    LightBlue: wglt.Colors.LIGHT_BLUE as any as Color,
    DarkBlue: wglt.Colors.DARK_BLUE as any as Color,
    LightMagenta: wglt.Colors.LIGHT_MAGENTA as any as Color,
    DarkMagenta: wglt.Colors.DARK_MAGENTA as any as Color,
    Orange: wglt.Colors.ORANGE as any as Color,
    fromRgb: (r: number, g: number, b: number, a = 255) => wglt.fromRgb(r, g, b, a) as any as Color,
    toRgb: (c: Color) => ({ r: c as any >> 24 & 0xff, g: c as any >> 16 & 0xff, b: c as any >> 8 & 0xff }),
    blend: (c1: Color, c2: Color, amount: number) => {
        const rgb1 = Color.toRgb(c1);
        const rgb2 = Color.toRgb(c2);
        const v1 = 1 - amount;
        const v2 = amount;
        const r = (rgb1.r * v1 + rgb2.r * v2);
        const g = (rgb1.g * v1 + rgb2.g * v2);
        const b = (rgb1.b * v1 + rgb2.b * v2);
        return Color.fromRgb(r, g, b);
    },
}