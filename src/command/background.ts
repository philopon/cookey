import * as Dir from "./direction";

export const SWITCH_TAB = "switch-tab";

export interface SwitchTabOptions {
    direction: Dir.LR;
    cycle: boolean;
}

export interface SwitchTab extends SwitchTabOptions {
    type: typeof SWITCH_TAB;
}

export const RELOAD = "reload";

export interface ReloadOptions {
    bypassCache: boolean;
}

export interface Reload extends ReloadOptions {
    type: typeof RELOAD;
}

export const NEW_TAB = "new-tab";

export interface NewTabOptions {
    address: string;
    background: boolean;
    position: typeof Dir.LEFT | typeof Dir.RIGHT | typeof Dir.LAST | typeof Dir.FIRST;
}

export interface NewTab extends NewTabOptions {
    type: typeof NEW_TAB;
}

export const CLOSE_TAB = "close-tab";

export interface CloseTabOptions {
    dontCloseLastTab: boolean;
    dontClosePinnedTab: boolean;
}

export interface CloseTab extends CloseTabOptions {
    type: typeof CLOSE_TAB;
}

export const YANK = "yank";

export interface YankOptions {}

export interface Yank extends YankOptions {
    type: typeof YANK;
}

export const PASTE = "paste";

interface NewTabPasteOptions extends Omit<NewTabOptions, "address"> {
    newTab: true;
}

interface CurrentPasteOptions {
    newTab: false;
}

export type PasteOptions = NewTabPasteOptions | CurrentPasteOptions;

export type Paste = PasteOptions & { type: typeof PASTE };

export const GO_UP = "go-up";

export interface GoUpOptions {
    top: boolean;
}

export interface GoUp extends GoUpOptions {
    type: typeof GO_UP;
}

export const RESTORE_TAB = "restore-tab";

export interface RestoreTabOptions {}

export interface RestoreTab extends RestoreTabOptions {
    type: typeof RESTORE_TAB;
}

export type Commands = SwitchTab | Reload | NewTab | CloseTab | Yank | Paste | GoUp | RestoreTab;
