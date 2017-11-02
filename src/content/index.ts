import { Messages, KeyPress } from "../message";
import * as Cmd from "../command";
import { exhaustiveCheck } from "../utils";

import scroll from "./scroll";
import openPage from "./open-page";

window.addEventListener("keypress", async event => {
    await browser.runtime.sendMessage<Messages>(KeyPress(event));
});

browser.runtime.onMessage.addListener<Cmd.ClientCommands>(command => {
    switch (command.type) {
        case Cmd.SCROLL:
            scroll(command);
            break;
        case Cmd.OPEN_PAGE:
            appendHud();
            break;
        default:
            exhaustiveCheck(command);
    }
});

const div = document.createElement("div");
div.style.width = "5rem";
div.style.height = "35px";
div.style.fontSize = "18px";
div.style.padding = "4px";
div.style.backgroundColor = "black";
div.style.opacity = "0.5";
div.style.color = "white";
div.style.fontFamily = "monospace";
div.style.position = "fixed";
div.style.bottom = "0";
div.style.right = "10px";
div.innerText = "hoge";

function appendHud() {
    const body = document.querySelector("body");
    if (body) {
        body.appendChild(div);
        setTimeout(() => {
            body.removeChild(div);
        }, 1000);
    }
}
