import * as C2B from "../message/content-to-backend";
import * as B2C from "../message/backend-to-content";
import { AllCommands } from "../command";
import * as CC from "../command/content";
import * as BC from "../command/background";
import { exhaustiveCheck } from "../utils";
import { KeyFeeder, isModifierKey } from "../key";

import { scrollBy, scrollTo } from "./scroll";
import set_clipboard from "../set_clipboard";

let keyFeeder: KeyFeeder;

async function loadConfig(reload: boolean = false): Promise<void> {
    if (!reload && keyFeeder) {
        return;
    }
    const config = await browser.runtime.sendMessage<C2B.PullConfig, B2C.SendConfig>(
        C2B.PullConfig()
    );

    keyFeeder = new KeyFeeder(config.key);
}

window.addEventListener("keydown", async event => {
    await loadConfig();
    const activeNode = document.activeElement;

    if (isModifierKey(event.key)) {
        return;
    }

    if (activeNode && (activeNode.nodeName === "INPUT" || activeNode.nodeName === "TEXTAREA")) {
        return;
    }

    const [cmd, _feeded] = keyFeeder.feed(event);
    if (cmd === true || cmd === false) {
    } else {
        event.preventDefault();
        await dispatchCommand(cmd);
    }
});

async function dispatchContentCommand(command: CC.Commands): Promise<C2B.Messages | void> {
    switch (command.type) {
        case CC.SCROLL_BY:
            return scrollBy(command);
        case CC.SCROLL_TO:
            return scrollTo(command);
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
            return set_clipboard(response.value);
    }
}
