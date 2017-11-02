export const SWITCH_TAB = "SWITCH_TAB";

export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

export type LR = typeof LEFT | typeof RIGHT;
export type UD = typeof UP | typeof DOWN;
export type LRUD = LR | UD;

export interface SwitchTabOptions {
    direction: LR;
    count: number;
    cycle: boolean;
}

export interface SwitchTab extends SwitchTabOptions {
    type: typeof SWITCH_TAB;
}

export function SwitchTab(args: SwitchTabOptions): SwitchTab {
    return { type: SWITCH_TAB, ...args };
}

export const RELOAD = "RELOAD";

export interface ReloadOptions {
    bypassCache: boolean;
}

export interface Reload extends ReloadOptions {
    type: typeof RELOAD;
}

export function Reload(args: ReloadOptions): Reload {
    return { type: RELOAD, ...args };
}

export const SCROLL = "SCROLL";

export interface ScrollOptions {
    amount: number;
    direction: LRUD;
}

export interface Scroll extends ScrollOptions {
    type: typeof SCROLL;
}

export function Scroll(args: ScrollOptions): Scroll {
    return { type: SCROLL, ...args };
}

export const OPEN_PAGE = "OPEN_PAGE";

export interface OpenPageOptions {
    newTab: boolean;
    address: string;
}

export interface OpenPage extends OpenPageOptions {
    type: typeof OPEN_PAGE;
}

export function OpenPage(args: OpenPageOptions): OpenPage {
    return { type: OPEN_PAGE, ...args };
}

export type ClientCommands = Scroll | OpenPage;
export type BackgroundCommands = SwitchTab | Reload;
export type AllCommands = ClientCommands | BackgroundCommands;
