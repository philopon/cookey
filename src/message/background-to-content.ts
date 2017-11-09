import { AllCommands } from "../command";
import { ITree } from "../key";

export const SEND_CONFIG = "SEND_CONFIG";

export interface SendConfigPayload {
    key: ITree<AllCommands>;
    ignore: { [key: string]: string[][] };
}

export interface SendConfig extends SendConfigPayload {
    type: typeof SEND_CONFIG;
}

export function SendConfig(args: SendConfigPayload): SendConfig {
    return { type: SEND_CONFIG, ...args };
}

export const SET_CLIPBOARD = "set-clipboard";

export interface SetClipboardOptions {
    value: string;
}

export interface SetClipboard extends SetClipboardOptions {
    type: typeof SET_CLIPBOARD;
}

export function SetClipboard({ value }: SetClipboardOptions): SetClipboard {
    return { type: SET_CLIPBOARD, value };
}

export type Responses = SetClipboard;
