import * as Dir from "./direction";

export const SCROLL_BY = "scroll-by";

export interface ScrollByOptions {
    amount: number;
    direction: typeof Dir.HORIZONTAL | typeof Dir.VERTICAL;
}

export interface ScrollBy extends ScrollByOptions {
    type: typeof SCROLL_BY;
}

export function ScrollBy(args: ScrollByOptions): ScrollBy {
    return { type: SCROLL_BY, ...args };
}

export const SCROLL_TO = "scroll-to";

export interface ScrollToOptions {
    position: typeof Dir.TOP | typeof Dir.BOTTOM;
}

export interface ScrollTo extends ScrollToOptions {
    type: typeof SCROLL_TO;
}

export function ScrollTo(args: ScrollToOptions): ScrollTo {
    return { type: SCROLL_TO, ...args };
}

export const SET_CLIPBOARD = "set-clipboard";

export interface SetClipboardOptions {
    value: string;
}

export interface SetClipboard extends SetClipboardOptions {
    type: typeof SET_CLIPBOARD;
}

export function SetClipboard({ value }: SetClipboardOptions): SetClipboard {
    return { type: SET_CLIPBOARD, value };
}

export type Commands = ScrollBy | ScrollTo | SetClipboard;
