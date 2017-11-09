import * as C2B from "../message/content-to-background";
import * as B2C from "../message/background-to-content";
import { AllCommands } from "../command";
import * as CC from "../command/content";
import * as BC from "../command/background";
import { exhaustiveCheck } from "../utils";
import { KeyFeeder, isModifierKey } from "../key";

import { scrollBy, scrollTo } from "./scroll";
import historyGo from "./history";
import setClipboard from "../clipboard/set";

let keyFeeder: KeyFeeder;
let ignores: Array<{ pattern: RegExp; keys: string[][] }> = [];

async function loadConfig(reload: boolean = false): Promise<void> {
    if (!reload && keyFeeder) {
        return;
    }
    const config = await browser.runtime.sendMessage<C2B.PullConfig, B2C.SendConfig>(
        C2B.PullConfig()
    );

    keyFeeder = new KeyFeeder(config.key);
    ignores = [];
    for (const key of Object.keys(config.ignore || {})) {
        ignores.push({ pattern: new RegExp(key), keys: config.ignore[key] });
    }
}

function checkEqualKey(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function checkIgnore(feeded: string[]): boolean {
    const url = location.href;
    for (const { pattern, keys } of ignores) {
        if (pattern.test(url)) {
            for (const key of keys) {
                if (checkEqualKey(feeded, key)) {
                    return true;
                }
            }
            return false;
        }
    }
    return false;
}

async function handleKeydown(event: KeyboardEvent): Promise<void> {
    if (!keyFeeder) {
        event.preventDefault();
        event.stopImmediatePropagation();
        await loadConfig();
        event.target.dispatchEvent(event);
        return;
    }

    const activeNode = document.activeElement;
    if (isModifierKey(event.key)) {
        return;
    }

    if (activeNode && (activeNode.nodeName === "INPUT" || activeNode.nodeName === "TEXTAREA")) {
        return;
    }

    const [cmd, feeded] = keyFeeder.feed(event);
    if (cmd !== false) {
        if (checkIgnore(feeded)) {
            return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        if (cmd !== true) {
            await dispatchCommand(cmd);
        }
    }
}

window.addEventListener("keydown", handleKeydown, true);

async function dispatchContentCommand(command: CC.Commands): Promise<C2B.Messages | void> {
    switch (command.type) {
        case CC.SCROLL_BY:
            return scrollBy(command);
        case CC.SCROLL_TO:
            return scrollTo(command);
        case CC.HISTORY_GO:
            return historyGo(command);
        default:
            exhaustiveCheck(command);
    }
}

async function dispatchCommand(command: AllCommands): Promise<C2B.Messages | void> {
    if (CC.isContentCommand(command)) {
        return await dispatchContentCommand(command);
    }
    const response = await browser.runtime.sendMessage<BC.Commands, B2C.Responses | void>(command);
    if (response !== undefined) {
        await dispatchResponse(response);
    }
}

async function dispatchResponse(response: B2C.Responses): Promise<void> {
    switch (response.type) {
        case B2C.SET_CLIPBOARD:
            return setClipboard(response.value);
    }
}
