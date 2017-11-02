import * as Msg from "../message";
import * as Cmd from "../command";
import { exhaustiveCheck } from "../utils";
import { Config, KeyConfig } from "../config";

import switchTab from "./switch-tab";
import reload from "./reload";

(async function() {
    await browser.storage.local.set<Config>({
        key: {
            l: Cmd.SwitchTab({ direction: Cmd.RIGHT, count: 1, cycle: true }),
            h: Cmd.SwitchTab({ direction: Cmd.LEFT, count: 1, cycle: true }),
            r: Cmd.Reload({ bypassCache: false }),
            j: Cmd.Scroll({ amount: 150, direction: Cmd.DOWN }),
            k: Cmd.Scroll({ amount: 150, direction: Cmd.UP }),
            H: Cmd.Scroll({ amount: 150, direction: Cmd.LEFT }),
            L: Cmd.Scroll({ amount: 150, direction: Cmd.RIGHT }),
            o: Cmd.OpenPage({ address: "https://www.google.com", newTab: false }),
        },
        blurFocus: true,
    });
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
        default:
            await resend(cmd);
            exhaustiveCheck(cmd);
    }
}

(async () => {
    const keyConfig = (await browser.storage.local.get<KeyConfig>("key"))["key"];
    browser.runtime.onMessage.addListener<Msg.Messages>(async message => {
        switch (message.type) {
            case Msg.KEY_PRESS:
                const cmd = keyConfig[message.key];
                if (cmd === undefined) {
                    return;
                }
                await dispatchCommand(cmd as Cmd.BackgroundCommands);
                break;

            // default:
            // TODO: add exhaustive check
            // exhaustiveCheck(message);
        }
    });
})();
