import * as Dir from "./direction";

export const SWITCH_TAB = "switch-tab";

export interface SwitchTabOptions {
    direction: Dir.LR;
    count: number;
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

export const REMOVE_TAB = "remove-tab";

export interface RemoveTabOptions {
    dontCloseLastTab: boolean;
}

export interface RemoveTab extends RemoveTabOptions {
    type: typeof REMOVE_TAB;
}

export function RemoveTab(args: RemoveTabOptions): RemoveTab {
    return { type: REMOVE_TAB, ...args };
}

export type ClientCommands = ScrollBy | ScrollTo;
export type BackgroundCommands = SwitchTab | Reload | NewTab | RemoveTab;
export type AllCommands = ClientCommands | BackgroundCommands;
