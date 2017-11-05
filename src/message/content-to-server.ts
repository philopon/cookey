export const KEY_EVENT = "KEY_EVENT";

export interface KeyEventOptions {
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    key: string;
}

export interface KeyEvent extends KeyEventOptions {
    type: typeof KEY_EVENT;
}

export function KeyEvent({ key, altKey, ctrlKey, metaKey, shiftKey }: KeyEventOptions): KeyEvent {
    return { type: KEY_EVENT, key, altKey, ctrlKey, metaKey, shiftKey };
}

export const LOADED = "LOADED";

export interface Loaded {
    type: typeof LOADED;
}

export function Loaded(): Loaded {
    return { type: LOADED };
}

export type Messages = KeyEvent | Loaded;
