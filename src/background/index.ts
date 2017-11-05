import * as Msg from "../message/content-to-server";
import * as Cmd from "../command";
import * as Dir from "../command/direction";
import { exhaustiveCheck } from "../utils";
import { Config, KeyConfig } from "../config";
import { KeyFeeder } from "./keyfeeder";

import switchTab from "./tab/switch";
import newTab from "./tab/new";
import removeTab from "./tab/remove";
import reload from "./reload";

let keyFeeder: KeyFeeder;

(async function() {
    await browser.storage.local.set<Config>({
        key: {
            l: Cmd.SwitchTab({ direction: Dir.RIGHT, count: 1, cycle: true }),
            h: Cmd.SwitchTab({ direction: Dir.LEFT, count: 1, cycle: true }),
            r: Cmd.Reload({ bypassCache: false }),
            j: Cmd.ScrollBy({ amount: 150, direction: Dir.VERTICAL }),
            k: Cmd.ScrollBy({ amount: -150, direction: Dir.VERTICAL }),
            H: Cmd.ScrollBy({ amount: -150, direction: Dir.HORIZONTAL }),
            L: Cmd.ScrollBy({ amount: 150, direction: Dir.HORIZONTAL }),
            t: Cmd.NewTab({
                address: "https://google.com",
                background: true,
                position: Dir.LAST,
            }),
            d: Cmd.RemoveTab({ dontCloseLastTab: true }),
            G: Cmd.ScrollTo({ position: Dir.BOTTOM }),
            "g g": Cmd.ScrollTo({ position: Dir.TOP }),
        },
        blurFocus: false,
    });
})();

(async () => {
    keyFeeder = new KeyFeeder((await browser.storage.local.get<KeyConfig>("key"))["key"]);
})();

async function resend<T>(msg: T) {
    const [tab] = await browser.tabs.query({ active: true });
    browser.tabs.sendMessage(tab.id, msg);
}

async function dispatchCommand(cmd: Cmd.BackgroundCommands) {
    switch (cmd.type) {
        case Cmd.SWITCH_TAB:
            await switchTab(cmd);
            break;
        case Cmd.RELOAD:
            await reload(cmd);
            break;
        case Cmd.NEW_TAB:
            await newTab(cmd);
            break;

        case Cmd.REMOVE_TAB:
            await removeTab(cmd);
            break;
        default:
            await resend(cmd);
            exhaustiveCheck(cmd);
    }
}

async function blurFocus(id: number) {
    await browser.tabs.executeScript(id, {
        allFrames: true,
        matchAboutBlank: true,
        runAt: "document_start",
        file: "/js/blur-focus.js",
    });
}

browser.runtime.onMessage.addListener<Msg.Messages>(async (message, sender) => {
    switch (message.type) {
        case Msg.KEY_EVENT:
            const cmd = keyFeeder.feed(message);
            if (cmd === undefined || cmd === true || cmd === false) {
                return;
            }
            await dispatchCommand(cmd as Cmd.BackgroundCommands);
            break;

        case Msg.LOADED:
            await blurFocus(sender.tab.id);
            break;

        default:
            exhaustiveCheck(message);
    }
});
