import * as BC from "../command/background";
import * as CC from "../command/content";
import { AllCommands } from "../command";
import * as Dir from "../command/direction";
import { exhaustiveCheck } from "../utils";
import { Config, KeyConfig } from "../config";
import { Tree } from "../key";
import * as B2C from "../message/backend-to-content";
import * as C2B from "../message/content-to-backend";

import switchTab from "./tab/switch";
import newTab from "./tab/new";
import closeTab from "./tab/close";
import reload from "./reload";
import yank from "./tab/yank";
import paste from "./tab/paste";

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
        blurFocus: true,
    });
})();

let keyConfig: Tree<AllCommands> | undefined = undefined;
let doBlurFocus: boolean = false;

(async () => {
    const { key } = await browser.storage.local.get<KeyConfig>("key");
    const { blurFocus } = await browser.storage.local.get<boolean>("blurFocus");
    doBlurFocus = blurFocus;
    keyConfig = Tree.compile(key);
})();

async function dispatchCommand(
    cmd: BC.Commands | C2B.Messages,
    sender: browser.runtime.MessageSender
): Promise<B2C.Responses | B2C.SendConfig | void> {
    switch (cmd.type) {
        case C2B.LOADED:
            if (doBlurFocus) {
                await blurFocus(sender.tab.id);
            }
            if (keyConfig) {
                return B2C.SendConfig({ key: keyConfig });
            }
            return;
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

browser.runtime.onMessage.addListener<
    C2B.Messages | BC.Commands,
    B2C.Responses | B2C.SendConfig | void
>(dispatchCommand);
