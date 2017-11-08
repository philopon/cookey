import * as Dir from "./direction";

export const SCROLL_BY = "scroll-by";

export interface ScrollByOptions {
    amount: number;
    direction: typeof Dir.HORIZONTAL | typeof Dir.VERTICAL;
}

export interface ScrollBy extends ScrollByOptions {
    type: typeof SCROLL_BY;
}

export const SCROLL_TO = "scroll-to";

export interface ScrollToOptions {
    position: typeof Dir.TOP | typeof Dir.BOTTOM;
}

export interface ScrollTo extends ScrollToOptions {
    type: typeof SCROLL_TO;
}

export const HISTORY_GO = "history-go";

export interface HistoryGoOptions {
    amount: number;
}

export interface HistoryGo extends HistoryGoOptions {
    type: typeof HISTORY_GO;
}

export type Commands = ScrollBy | ScrollTo | HistoryGo;

const commands = new Set([SCROLL_BY, SCROLL_TO, HISTORY_GO]);

export function isContentCommand(cmd: { type: string }): cmd is Commands {
    return commands.has(cmd.type);
}
