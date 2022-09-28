import { Mathx } from "./Mathx";
import { assert } from "./misc";

declare global {
    interface String {
        firstCapital(): string;
        prependA(): string;
    }
}

String.prototype.firstCapital = function () {
    const str = this as string;
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}
String.prototype.prependA = function () {
    const str = this as string;
    if (str.startsWith('a') || str.startsWith('i') || str.startsWith('e') || str.startsWith('o') || (str.startsWith('u') && !str.startsWith('un'))) {
        return 'an ' + str;
    } else {
        return 'a ' + str;
    }
}
Object.prototype.toString = function () {
    return describeObject(this, 2);
}


export function describeObject(obj: any, maxDepth = 1, depth = 0, seen = new Map<any, string>(), path = '#'): string {
    if (seen.has(obj)) return `${seen.get(obj)}`;
    if (obj instanceof Array) {

        if (depth == maxDepth) return `Array(${obj.length})`;

        seen.set(obj, path);
        const props = [];
        for (let i = 0; i < obj.length; i++) {
            const v = obj[i];
            props.push(describeObject(v, maxDepth, depth + 1, seen, `${path}.${i}`));
        }
        //seen.delete(obj);
        return `[${props.join(', ')}]`;
    } else if (obj instanceof Object) {
        const name = (obj as Object).constructor.name;

        if (depth == maxDepth) return `${name} {…}`;

        seen.set(obj, path);
        const props = [];
        for (let p in obj) {
            if ((obj as Object).hasOwnProperty(p)) {
                props.push(`${p}: ${describeObject(obj[p], maxDepth, depth + 1, seen, `${path}.${p}`)}`);
            }
        }
        //seen.delete(obj);
        return `${name} {${props.join(', ')}}`;
    } else {
        return obj + '';
    }
}

export function breakLines(str: string, width: number): string[][] {
    const paragraphs = str.split('\n');
    const lines = [];
    for (let p of paragraphs) {
        var line: string[] = [];
        var lineSpacesLeft = width;
        for (let word of p.split(' ').filter(s => s.length > 0)) {
            if (lineSpacesLeft >= word.length) {
                line.push(word);
                lineSpacesLeft -= (word.length + 1);
            } else {
                lines.push(line);
                line = [word];
                lineSpacesLeft = width - (word.length + 1);
            }
        }
        lines.push(line);
    }
    return lines;
}

export function amountWithUnitSI(amount: number, offset = 0): { amount: number, unit: string } {
    const prefix = ['z', 'f', 'n', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Y'];
    const scale = amount === 0 ? 0 : Mathx.clamp(-4, 7, Math.floor((Math.log10(Math.abs(amount)) + offset) / 3));
    return { amount: amount / Math.pow(10, scale * 3), unit: prefix[scale + 4] };
}

const pair = (digit: string, value: number) => ({ digit, value });
const romanDigits = [
    pair('I', 1), pair('IV', 4), pair('V', 5), pair('IX', 9), pair('X', 10),
    pair('XL', 40), pair('L', 50), pair('XC', 90), pair('C', 100),
    pair('CD', 400), pair('D', 500), pair('CM', 900), pair('M', 1000)
];

export function romanNumber(n: number): string {
    assert(Number.isInteger(n) && n > 0 && n < 4000);
    var result = '';
    var d = romanDigits.length - 1;
    while (n > 0 && d >= 0) {
        const digit = romanDigits[d];
        if (n >= digit.value) {
            n -= digit.value;
            result += digit.digit;
        } else d--;
    }
    return result;
}

export function toDigits(value: number, digits: number) {
    if (value === 0) return '0';
    const firstDigit = Math.floor(Math.log10(value));
    const showDigits = Mathx.clamp(0, 8, -1 - firstDigit + digits);
    return value.toFixed(showDigits);
}