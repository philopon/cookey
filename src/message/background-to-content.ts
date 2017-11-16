import { AllCommands } from "../command";
import { ITree } from "../key";

export const SEND_CONFIG = "SEND_CONFIG";

export interface SendConfig {
    type: typeof SEND_CONFIG;
    key: ITree<AllCommands>;
    ignore: { [key: string]: string[][] };
    blurFocus: boolean;
}

export function SendConfig(args: Options<SendConfig>): SendConfig {
    return { type: SEND_CONFIG, ...args };
}

export const SET_CLIPBOARD = "SET_CLIPBOARD";

export interface SetClipboard {
    type: typeof SET_CLIPBOARD;
    value: string;
}

export function SetClipboard(args: Options<SetClipboard>): SetClipboard {
    return { type: SET_CLIPBOARD, ...args };
}

export const START_SEARCH = "START_SEARCH";

export interface StartSearch {
    type: typeof START_SEARCH;
    query: string;
    caseSensitive: boolean;
}

export function StartSearch(args: Options<StartSearch>): StartSearch {
    return { type: START_SEARCH, ...args };
}

export const SEARCH_JUMP = "SEARCH_JUMP";

export interface SearchJump {
    type: typeof SEARCH_JUMP;
    query: string;
    backward: boolean;
    wrapAround: boolean;
    caseSensitive: boolean;
}

export function SearchJump(args: Options<SearchJump>): SearchJump {
    return { type: SEARCH_JUMP, ...args };
}

export type Messages = SendConfig | SetClipboard | SearchJump | StartSearch;
