import * as Msg from "../message/content-to-server";
import * as BC from "../command/background";
import * as CC from "../command/content";
import * as Dir from "../command/direction";
import { exhaustiveCheck } from "../utils";
import { Config, KeyConfig } from "../config";
import { KeyFeeder } from "./keyfeeder";

import switchTab from "./tab/switch";
import newTab from "./tab/new";
import closeTab from "./tab/close";
import reload from "./reload";
import yank from "./tab/yank";
import paste from "./tab/paste";

let keyFeeder: KeyFeeder;

(async function() {
    await browser.storage.local.set<Config>({
        key: {
            l: BC.SwitchTab({ direction: Dir.RIGHT, count: 1, cycle: true }),
            h: BC.SwitchTab({ direction: Dir.LEFT, count: 1, cycle: true }),
            r: BC.Reload({ bypassCache: false }),
            R: BC.Reload({ bypassCache: true }),
            j: CC.ScrollBy({ amount: 150, direction: Dir.VERTICAL }),
            k: CC.ScrollBy({ amount: -150, direction: Dir.VERTICAL }),
            H: CC.ScrollBy({ amount: -150, direction: Dir.HORIZONTAL }),
            L: CC.ScrollBy({ amount: 150, direction: Dir.HORIZONTAL }),
            t: BC.NewTab({
                address: "https://google.com",
                background: true,
                position: Dir.LAST,
            }),
            d: BC.RemoveTab({ dontCloseLastTab: true, dontClosePinnedTab: true }),
            G: CC.ScrollTo({ position: Dir.BOTTOM }),
            "g g": CC.ScrollTo({ position: Dir.TOP }),
            "y y": BC.Yank({}),
            p: BC.Paste({ newTab: false }),
            P: BC.Paste({ newTab: true, background: false, position: Dir.RIGHT }),
        },
        blurFocus: false,
    });
})();

(async () => {
    const { key } = await browser.storage.local.get<KeyConfig>("key");
    keyFeeder = new KeyFeeder(key);
})();

async function dispatchCommand(cmd: BC.Commands): Promise<CC.Commands | void> {
    switch (cmd.type) {
        case BC.SWITCH_TAB:
            return await switchTab(cmd);
        case BC.RELOAD:
            return await reload(cmd);
        case BC.NEW_TAB:
            return await newTab(cmd);
        case BC.CLOSE_TAB:
            return await closeTab(cmd);
        case BC.YANK:
            return await yank(cmd);
        case BC.PASTE:
            return await paste(cmd);
        default:
            exhaustiveCheck(cmd);
            return cmd;
    }
}

async function blurFocus(id: number): Promise<void> {
    await browser.tabs.executeScript(id, {
        allFrames: true,
        matchAboutBlank: true,
        runAt: "document_start",
        file: "/js/blur-focus.js",
    });
}

browser.runtime.onMessage.addListener<Msg.Messages>(async function(
    message,
    sender
): Promise<CC.Commands | void> {
    switch (message.type) {
        case Msg.KEY_EVENT:
            const cmd = keyFeeder.feed(message);
            if (cmd === undefined || cmd === true || cmd === false) {
                return;
            }
            return await dispatchCommand(cmd as BC.Commands);

        case Msg.LOADED:
            return await blurFocus(sender.tab.id);

        default:
            exhaustiveCheck(message);
            return;
    }
});
