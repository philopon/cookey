export const KEY_PRESS = "keypress";

export interface KeyPressOptions {
    key: string;
}

export interface KeyPress extends KeyPressOptions {
    type: typeof KEY_PRESS;
}

export function KeyPress({ key }: KeyPressOptions): KeyPress {
    return { type: KEY_PRESS, key };
}

export type Messages = KeyPress;
