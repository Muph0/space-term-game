import { Font } from 'wglt';


export const FIXEDSYS: Font = {
    charWidth: 8,
    charHeight: 16,
    graphical: false,
    scale: 1,
    get url() { return FONT_DATA },
}

const FONT_DATA = `data:image/png;base64,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`
    .replace(/\n/g, '');

