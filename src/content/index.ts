// import * as style from "../../sass/content.scss";
import { Messages, KeyEvent, Loaded } from "../message/content-to-server";
import * as Cmd from "../command";
import { exhaustiveCheck } from "../utils";

import { scrollBy, scrollTo } from "./scroll";

window.addEventListener("keypress", async event => {
    const activeNode = document.activeElement;
    if (activeNode.nodeName === "INPUT" || activeNode.nodeName === "TEXTAREA") {
        return;
    }
    await browser.runtime.sendMessage<Messages>(KeyEvent(event));
});

browser.runtime.onMessage.addListener<Cmd.ClientCommands>(async command => {
    switch (command.type) {
        case Cmd.SCROLL_BY:
            await scrollBy(command);
            break;
        case Cmd.SCROLL_TO:
            await scrollTo(command);
            break;

        default:
            exhaustiveCheck(command);
    }
});

browser.runtime.sendMessage(Loaded());

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
