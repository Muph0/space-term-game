
export function isKeyPrintable(evt: KeyboardEvent): boolean {
    return evt.key.length === 1;
}

export const enum Keys {
    /** `~ on a US keyboard. This is the 半角/全角/漢字 (hankaku/zenkaku/kanji) key on Japanese keyboards */
    Backquote = 'Backquote',
    /** Used for both the US \| (on the 101-key layout) and also for the key located between the ' and Enter keys on row C of the 102-, 104- and 106-key layouts. Labelled #~ on a UK (102) keyboard. */
    Backslash = 'Backslash',
    /** Backspace or ⌫. Labelled Delete on Apple keyboards. */
    Backspace = 'Backspace',
    /** [{ on a US keyboard. */
    BracketLeft = 'BracketLeft',
    /** ]} on a US keyboard. */
    BracketRight = 'BracketRight',
    /** ,< on a US keyboard. */
    Comma = 'Comma',
    /** 0) on a US keyboard. */
    Digit0 = 'Digit0',
    /** 1! on a US keyboard. */
    Digit1 = 'Digit1',
    /** 2@ on a US keyboard. */
    Digit2 = 'Digit2',
    /** 3# on a US keyboard. */
    Digit3 = 'Digit3',
    /** 4$ on a US keyboard. */
    Digit4 = 'Digit4',
    /** 5% on a US keyboard. */
    Digit5 = 'Digit5',
    /** 6^ on a US keyboard. */
    Digit6 = 'Digit6',
    /** 7& on a US keyboard. */
    Digit7 = 'Digit7',
    /** 8* on a US keyboard. */
    Digit8 = 'Digit8',
    /** 9( on a US keyboard. */
    Digit9 = 'Digit9',
    /** =+ on a US keyboard. */
    Equal = 'Equal',
    /** Located between the left Shift and Z keys. Labelled \| on a UK keyboard. */
    IntlBackslash = 'IntlBackslash',
    /** Located between the / and right Shift keys. Labelled \ろ (ro) on a Japanese keyboard. */
    IntlRo = 'IntlRo',
    /** Located between the = and Backspace keys. Labelled ¥ (yen) on a Japanese keyboard. \/ on a Russian keyboard. */
    IntlYen = 'IntlYen',
    /** a on a US keyboard. Labelled q on an AZERTY (e.g., French) keyboard. */
    KeyA = 'KeyA',
    /** b on a US keyboard. */
    KeyB = 'KeyB',
    /** c on a US keyboard. */
    KeyC = 'KeyC',
    /** d on a US keyboard. */
    KeyD = 'KeyD',
    /** e on a US keyboard. */
    KeyE = 'KeyE',
    /** f on a US keyboard. */
    KeyF = 'KeyF',
    /** g on a US keyboard. */
    KeyG = 'KeyG',
    /** h on a US keyboard. */
    KeyH = 'KeyH',
    /** i on a US keyboard. */
    KeyI = 'KeyI',
    /** j on a US keyboard. */
    KeyJ = 'KeyJ',
    /** k on a US keyboard. */
    KeyK = 'KeyK',
    /** l on a US keyboard. */
    KeyL = 'KeyL',
    /** m on a US keyboard. */
    KeyM = 'KeyM',
    /** n on a US keyboard. */
    KeyN = 'KeyN',
    /** o on a US keyboard. */
    KeyO = 'KeyO',
    /** p on a US keyboard. */
    KeyP = 'KeyP',
    /** q on a US keyboard. Labelled a on an AZERTY (e.g., French) keyboard. */
    KeyQ = 'KeyQ',
    /** r on a US keyboard. */
    KeyR = 'KeyR',
    /** s on a US keyboard. */
    KeyS = 'KeyS',
    /** t on a US keyboard. */
    KeyT = 'KeyT',
    /** u on a US keyboard. */
    KeyU = 'KeyU',
    /** v on a US keyboard. */
    KeyV = 'KeyV',
    /** w on a US keyboard. Labelled z on an AZERTY (e.g., French) keyboard. */
    KeyW = 'KeyW',
    /** x on a US keyboard. */
    KeyX = 'KeyX',
    /** y on a US keyboard. Labelled z on a QWERTZ (e.g., German) keyboard. */
    KeyY = 'KeyY',
    /** z on a US keyboard. Labelled w on an AZERTY (e.g., French) keyboard, and y on a QWERTZ (e.g., German) keyboard. */
    KeyZ = 'KeyZ',
    /** -_ on a US keyboard. */
    Minus = 'Minus',
    /** .> on a US keyboard. */
    Period = 'Period',
    /** '' on a US keyboard. */
    Quote = 'Quote',
    /** ;: on a US keyboard. */
    Semicolon = 'Semicolon',
    /** /? on a US keyboard. */
    Slash = 'Slash',
    /** Alt, Option or ⌥. */
    AltLeft = 'AltLeft',
    /** Alt, Option or ⌥. This is labelled AltGr key on many keyboard layouts. */
    AltRight = 'AltRight',
    /** CapsLock or ⇪ */
    CapsLock = 'CapsLock',
    /** The application context menu key, which is typically found between the right Meta key and the right Control key. */
    ContextMenu = 'ContextMenu',
    /** Control or ⌃ */
    ControlLeft = 'ControlLeft',
    /** Control or ⌃ */
    ControlRight = 'ControlRight',
    /** Enter or ↵. Labelled Return on Apple keyboards. */
    Enter = 'Enter',
    /** The Windows, ⌘, Command or other OS symbol key. */
    MetaLeft = 'MetaLeft',
    /** The Windows, ⌘, Command or other OS symbol key. */
    MetaRight = 'MetaRight',
    /** Shift or ⇧ */
    ShiftLeft = 'ShiftLeft',
    /** Shift or ⇧ */
    ShiftRight = 'ShiftRight',
    /**   (space) */
    Space = 'Space',
    /** Tab or ⇥ */
    Tab = 'Tab',
    /** Japanese: 変換 (henkan) */
    Convert = 'Convert',
    /** Japanese: カタカナ/ひらがな/ローマ字 (katakana/hiragana/romaji) */
    KanaMode = 'KanaMode',
    /** Korean: HangulMode 한/영 (han/yeong) / Japanese (Mac keyboard): かな (kana) */
    Lang1 = 'Lang1',
    /** Korean: Hanja 한자 (hanja) / Japanese (Mac keyboard): 英数 (eisu) */
    Lang2 = 'Lang2',
    /** Japanese (word-processing keyboard): Katakana */
    Lang3 = 'Lang3',
    /** Japanese (word-processing keyboard): Hiragana */
    Lang4 = 'Lang4',
    /** Japanese (word-processing keyboard): Zenkaku/Hankaku */
    Lang5 = 'Lang5',
    /** Japanese: 無変換 (muhenkan) */
    NonConvert = 'NonConvert',
    /** ⌦. The forward delete key. Note that on Apple keyboards, the key labelled Delete on the main part of the keyboard should be encoded as 'Backspace'. */
    Delete = 'Delete',
    /** Page Down, End or ↘ */
    End = 'End',
    /** Help. Not present on standard PC keyboards. */
    Help = 'Help',
    /** Home or ↖ */
    Home = 'Home',
    /** Insert or Ins. Not present on Apple keyboards. */
    Insert = 'Insert',
    /** Page Down, PgDn or ⇟ */
    PageDown = 'PageDown',
    /** Page Up, PgUp or ⇞ */
    PageUp = 'PageUp',
    /** ↓ */
    ArrowDown = 'ArrowDown',
    /** ← */
    ArrowLeft = 'ArrowLeft',
    /** → */
    ArrowRight = 'ArrowRight',
    /** ↑ */
    ArrowUp = 'ArrowUp',
    /** On the Mac, the 'NumLock' code should be used for the numpad Clear key. */
    NumLock = 'NumLock',
    /** 0 Ins on a keyboard / 0 on a phone or remote control */
    Numpad0 = 'Numpad0',
    /** 1 End on a keyboard / 1 or 1 QZ on a phone or remote control */
    Numpad1 = 'Numpad1',
    /** 2 ↓ on a keyboard / 2 ABC on a phone or remote control */
    Numpad2 = 'Numpad2',
    /** 3 PgDn on a keyboard / 3 DEF on a phone or remote control */
    Numpad3 = 'Numpad3',
    /** 4 ← on a keyboard / 4 GHI on a phone or remote control */
    Numpad4 = 'Numpad4',
    /** 5 on a keyboard / 5 JKL on a phone or remote control */
    Numpad5 = 'Numpad5',
    /** 6 → on a keyboard / 6 MNO on a phone or remote control */
    Numpad6 = 'Numpad6',
    /** 7 Home on a keyboard / 7 PQRS or 7 PRS on a phone or remote control */
    Numpad7 = 'Numpad7',
    /** 8 ↑ on a keyboard / 8 TUV on a phone or remote control */
    Numpad8 = 'Numpad8',
    /** 9 PgUp on a keyboard / 9 WXYZ or 9 WXY on a phone or remote control */
    Numpad9 = 'Numpad9',
    /** + */
    NumpadAdd = 'NumpadAdd',
    /** Found on the Microsoft Natural Keyboard. */
    NumpadBackspace = 'NumpadBackspace',
    /** C or AC (All Clear). Also for use with numpads that have a Clear key that is separate from the NumLock key. On the Mac, the numpad Clear key should always be encoded as 'NumLock'. */
    NumpadClear = 'NumpadClear',
    /** CE (Clear Entry) */
    NumpadClearEntry = 'NumpadClearEntry',
    /** , (thousands separator). For locales where the thousands separator is a '.' (e.g., Brazil), this key may generate a .. */
    NumpadComma = 'NumpadComma',
    /** . Del. For locales where the decimal separator is ',' (e.g., Brazil), this key may generate a ,. */
    NumpadDecimal = 'NumpadDecimal',
    /** / */
    NumpadDivide = 'NumpadDivide',
    /** */
    NumpadEnter = 'NumpadEnter',
    /** = */
    NumpadEqual = 'NumpadEqual',
    /** # on a phone or remote control device. This key is typically found below the 9 key and to the right of the 0 key. */
    NumpadHash = 'NumpadHash',
    /** M+ Add current entry to the value stored in memory. */
    NumpadMemoryAdd = 'NumpadMemoryAdd',
    /** MC Clear the value stored in memory. */
    NumpadMemoryClear = 'NumpadMemoryClear',
    /** MR Replace the current entry with the value stored in memory. */
    NumpadMemoryRecall = 'NumpadMemoryRecall',
    /** MS Replace the value stored in memory with the current entry. */
    NumpadMemoryStore = 'NumpadMemoryStore',
    /** M- Subtract current entry from the value stored in memory. */
    NumpadMemorySubtract = 'NumpadMemorySubtract',
    /** * on a keyboard. For use with numpads that provide mathematical operations (+, -, * and /). */
    NumpadMultiply = 'NumpadMultiply',
    /** * on a phone or remote control device. This key is typically found below the 7 key and to the left of the 0 key. */
    NumpadStar = 'NumpadStar',
    /** ( Found on the Microsoft Natural Keyboard. */
    NumpadParenLeft = 'NumpadParenLeft',
    /** ) Found on the Microsoft Natural Keyboard. */
    NumpadParenRight = 'NumpadParenRight',
    /** - */
    NumpadSubtract = 'NumpadSubtract',
    /** Esc or ⎋ */
    Escape = 'Escape',
    /** F1 */
    F1 = 'F1',
    /** F2 */
    F2 = 'F2',
    /** F3 */
    F3 = 'F3',
    /** F4 */
    F4 = 'F4',
    /** F5 */
    F5 = 'F5',
    /** F6 */
    F6 = 'F6',
    /** F7 */
    F7 = 'F7',
    /** F8 */
    F8 = 'F8',
    /** F9 */
    F9 = 'F9',
    /** F10 */
    F10 = 'F10',
    /** F11 */
    F11 = 'F11',
    /** F12 */
    F12 = 'F12',
    /** Fn This is typically a hardware key that does not generate a separate code. Most keyboards do not place this key in the function section, but it is included here to keep it with related keys. */
    Fn = 'Fn',
    /** FLock or FnLock. Function Lock key. Found on the Microsoft Natural Keyboard. */
    FnLock = 'FnLock',
    /** PrtScr SysRq or Print Screen */
    PrintScreen = 'PrintScreen',
    /** Scroll Lock */
    ScrollLock = 'ScrollLock',
    /** Pause Break */
    Pause = 'Pause',
}
