import { AllCommands } from "../command";
import { ITree } from "../key";

export const SEND_CONFIG = "SEND_CONFIG";

export interface SendConfigPayload {
    key: ITree<AllCommands>;
    ignore: { [key: string]: string[][] };
    blurFocus: boolean;
}

export interface SendConfig extends SendConfigPayload {
    type: typeof SEND_CONFIG;
}

export function SendConfig(args: SendConfigPayload): SendConfig {
    return { type: SEND_CONFIG, ...args };
}

export const SET_CLIPBOARD = "SET_CLIPBOARD";

export interface SetClipboardOptions {
    value: string;
}

export interface SetClipboard extends SetClipboardOptions {
    type: typeof SET_CLIPBOARD;
}

export function SetClipboard(args: SetClipboardOptions): SetClipboard {
    return { type: SET_CLIPBOARD, ...args };
}

export const START_SEARCH_MSG = "START_SEARCH_MSG";

export interface StartSearchMsgOptions {
    query: string;
    caseSensitive: boolean;
}

export interface StartSearchMsg extends StartSearchMsgOptions {
    type: typeof START_SEARCH_MSG;
}

export function StartSearchMsg(args: StartSearchMsgOptions): StartSearchMsg {
    return { type: START_SEARCH_MSG, ...args };
}

export const SEARCH_JUMP_MSG = "SEARCH_JUMP_MSG";

export interface SearchJumpMsgOptions {
    query: string;
    backward: boolean;
    wrapAround: boolean;
    caseSensitive: boolean;
}

export interface SearchJumpMsg extends SearchJumpMsgOptions {
    type: typeof SEARCH_JUMP_MSG;
}

export function SearchJumpMsg(args: SearchJumpMsgOptions): SearchJumpMsg {
    return { type: SEARCH_JUMP_MSG, ...args };
}

export type Messages = SendConfig | SetClipboard | SearchJumpMsg | StartSearchMsg;
