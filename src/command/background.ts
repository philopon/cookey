import * as Dir from "./direction";

export const SWITCH_TAB = "switch-tab";

export interface SwitchTab {
    type: typeof SWITCH_TAB;
    direction: Dir.LR;
    cycle?: boolean;
}

export const RELOAD = "reload";

export interface Reload {
    type: typeof RELOAD;
    bypassCache?: boolean;
}

export const NEW_TAB = "new-tab";

export interface NewTab {
    type: typeof NEW_TAB;
    url?: string;
    background?: boolean;
    position?: typeof Dir.LEFT | typeof Dir.RIGHT | typeof Dir.LAST | typeof Dir.FIRST;
}

export const CLOSE_TAB = "close-tab";

export interface CloseTab {
    type: typeof CLOSE_TAB;
    dontCloseLastTab?: boolean;
    dontClosePinnedTab?: boolean;
}

export const YANK = "yank";

export interface Yank {
    type: typeof YANK;
    format?: string;
}

export const PASTE = "paste";

interface NewTabPasteOptions extends Omit<Options<NewTab>, "url"> {
    newTab: true;
}

interface CurrentPasteOptions {
    newTab?: false;
}

export type PasteOptions = NewTabPasteOptions | CurrentPasteOptions;
export type Paste = PasteOptions & { type: typeof PASTE };

export const GO_UP = "go-up";

export interface GoUp {
    type: typeof GO_UP;
    top?: boolean;
}

export const RESTORE_TAB = "restore-tab";

export interface RestoreTab {
    type: typeof RESTORE_TAB;
}

export const START_SEARCH = "start-search";

export interface StartSearch {
    type: typeof START_SEARCH;
    caseSensitive?: boolean;
}

export const SEARCH_JUMP = "search-jump";

export interface SearchJump {
    type: typeof SEARCH_JUMP;
    wrapAround?: boolean;
    backward?: boolean;
}

export type Commands =
    | SwitchTab
    | Reload
    | NewTab
    | CloseTab
    | Yank
    | Paste
    | GoUp
    | RestoreTab
    | StartSearch
    | SearchJump;
