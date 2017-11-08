import * as Dir from "./direction";

export const SWITCH_TAB = "switch-tab";

export interface SwitchTabOptions {
    direction: Dir.LR;
    cycle: boolean;
}

export interface SwitchTab extends SwitchTabOptions {
    type: typeof SWITCH_TAB;
}

export function SwitchTab(args: SwitchTabOptions): SwitchTab {
    return { type: SWITCH_TAB, ...args };
}

export const RELOAD = "reload";

export interface ReloadOptions {
    bypassCache: boolean;
}

export interface Reload extends ReloadOptions {
    type: typeof RELOAD;
}

export function Reload(args: ReloadOptions): Reload {
    return { type: RELOAD, ...args };
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

export function NewTab(args: NewTabOptions): NewTab {
    return { type: NEW_TAB, ...args };
}

export const CLOSE_TAB = "close-tab";

export interface CloseTabOptions {
    dontCloseLastTab: boolean;
    dontClosePinnedTab: boolean;
}

export interface CloseTab extends CloseTabOptions {
    type: typeof CLOSE_TAB;
}

export function CloseTab(args: CloseTabOptions): CloseTab {
    return { type: CLOSE_TAB, ...args };
}

export const YANK = "yank";

export interface YankOptions {}

export interface Yank extends YankOptions {
    type: typeof YANK;
}

export function Yank(_: YankOptions): Yank {
    return { type: YANK };
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

export function Paste(args: PasteOptions): Paste {
    return { type: PASTE, ...args };
}

export type Commands = SwitchTab | Reload | NewTab | CloseTab | Yank | Paste;
