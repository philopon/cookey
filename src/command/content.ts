import * as Dir from "./direction";

export const SCROLL_BY = "scroll-by";

export interface ScrollBy {
    type: typeof SCROLL_BY;
    amount?: number;
    direction?: typeof Dir.HORIZONTAL | typeof Dir.VERTICAL;
}

export const SCROLL_TO = "scroll-to";

export interface ScrollTo {
    type: typeof SCROLL_TO;
    position: typeof Dir.TOP | typeof Dir.BOTTOM;
}

export const HISTORY_GO = "history-go";

export interface HistoryGo {
    type: typeof HISTORY_GO;
    amount: number;
}

export type Commands = ScrollBy | ScrollTo | HistoryGo;
