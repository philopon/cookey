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

export type Commands = ScrollBy | ScrollTo;

const commands = new Set([SCROLL_BY, SCROLL_TO]);

export function isContentCommand(cmd: { type: string }): cmd is Commands {
    return commands.has(cmd.type);
}
