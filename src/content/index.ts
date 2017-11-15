import * as C2B from "../message/content-to-background";
import * as B2C from "../message/background-to-content";
import { AllCommands } from "../command";
import * as CC from "../command/content";
import * as BC from "../command/background";
import { exhaustiveCheck } from "../utils";
import { KeyFeeder, isModifierKey, checkEqualKey } from "../key";

import { scrollBy, scrollTo } from "./scroll";
import historyGo from "./history";
import setClipboard from "../clipboard/set";
import BlurFocus from "../blur-focus";
import { startSearch, searchJump } from "./search";

let keyFeeder: KeyFeeder;
let ignores: Array<{ pattern: RegExp; keys: string[][] }> = [];

const blurFocus = new BlurFocus();

loadConfig();

function setConfig(config: B2C.SendConfigPayload): void {
    keyFeeder = new KeyFeeder(config.key);
    ignores = [];
    for (const key of Object.keys(config.ignore || {})) {
        ignores.push({ pattern: new RegExp(key), keys: config.ignore[key] });
    }

    if (config.blurFocus) {
        blurFocus.enable();
    }
}

async function loadConfig(reload: boolean = false): Promise<void> {
    if (!reload && keyFeeder) {
        return;
    }
    const config = await browser.runtime.sendMessage<C2B.PullConfig, B2C.SendConfig>(
        C2B.PullConfig()
    );

    setConfig(config);
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

window.addEventListener("keydown", handleKeydown, true);
window.addEventListener("mousedown", () => {
    blurFocus.touch();
});

async function handleKeydown(event: KeyboardEvent): Promise<void> {
    blurFocus.touch();
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

    if (
        activeNode &&
        (activeNode.nodeName === "INPUT" ||
            activeNode.nodeName === "TEXTAREA" ||
            (activeNode as HTMLElement).isContentEditable)
    ) {
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
            await dispatchLoop(cmd);
        }
    }
}

async function dispatchLoop(cmd: AllCommands | B2C.Messages | C2B.Messages): Promise<void> {
    const result = await dispatch(cmd as CC.Commands | B2C.Messages);
    if (result !== undefined) {
        const response = await browser.runtime.sendMessage<
            BC.Commands | C2B.Messages,
            CC.Commands | B2C.Messages | void
        >(result);
        if (response !== undefined) {
            await dispatchLoop(response);
        }
    }
}

async function dispatch(
    cmd: CC.Commands | B2C.Messages
): Promise<BC.Commands | C2B.Messages | void> {
    switch (cmd.type) {
        case CC.SCROLL_BY:
            return scrollBy(cmd);
        case CC.SCROLL_TO:
            return scrollTo(cmd);
        case CC.HISTORY_GO:
            return historyGo(cmd);
        case B2C.SEND_CONFIG:
            return setConfig(cmd);
        case B2C.SET_CLIPBOARD:
            return setClipboard(cmd.value);
        case B2C.START_SEARCH_MSG:
            return startSearch(cmd);
        case B2C.SEARCH_JUMP_MSG:
            return searchJump(cmd);
        default:
            exhaustiveCheck(cmd);
            return cmd;
    }
}

browser.runtime.onMessage.addListener<
    B2C.Messages | CC.Commands,
    C2B.Messages | BC.Commands | void
>(dispatch);
