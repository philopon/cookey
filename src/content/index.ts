// import * as style from "../../sass/content.scss";
import { Messages, KeyEvent, Loaded } from "../message/content-to-server";
import * as Cmd from "../command/content";
import { exhaustiveCheck } from "../utils";

import { scrollBy, scrollTo } from "./scroll";
import set_clipboard from "../set_clipboard";

const modifierKeys = new Set(["Control", "Shift", "Meta", "Alt"]);

window.addEventListener("keydown", async event => {
    if (modifierKeys.has(event.key)) {
        return;
    }

    const activeNode = document.activeElement;
    if (activeNode.nodeName === "INPUT" || activeNode.nodeName === "TEXTAREA") {
        return;
    }
    const command = await browser.runtime.sendMessage<Messages, Cmd.Commands | void>(
        KeyEvent(event)
    );
    if (command !== undefined) {
        await dispatchCommand(command);
    }
});

async function dispatchCommand(command: Cmd.Commands): Promise<void> {
    switch (command.type) {
        case Cmd.SCROLL_BY:
            return await scrollBy(command);
        case Cmd.SCROLL_TO:
            return await scrollTo(command);
        case Cmd.SET_CLIPBOARD:
            return set_clipboard(command.value);
        default:
            exhaustiveCheck(command);
    }
}

browser.runtime.sendMessage<Messages>(Loaded());

/*
const div = document.createElement("div");
div.classList.add(style.test);
div.innerText = "hoge";

function appendHud() {
    const body = document.body;
    body.appendChild(div);
    setTimeout(() => {
        body.removeChild(div);
    }, 1000);
}
*/
