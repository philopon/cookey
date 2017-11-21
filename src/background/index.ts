import * as BC from "../command/background";
import { exhaustiveCheck } from "../utils";
import * as B2C from "../message/background-to-content";
import * as C2B from "../message/content-to-background";

import switchTab from "./tab/switch";
import newTab from "./tab/new";
import closeTab from "./tab/close";
import reload from "./reload";
import yank from "./tab/yank";
import paste from "./tab/paste";
import goUp from "./go-up";
import restoreTab from "./tab/restore";
import { setQuery, startSearch, searchJump } from "./search";
import { ConfigManager } from "../config";

const config = new ConfigManager();

async function dispatch(
    cmd: BC.Commands | C2B.Messages,
    sender: browser.runtime.MessageSender
): Promise<void | B2C.SendConfig> {
    switch (cmd.type) {
        case C2B.LOAD_CONFIG:
            try {
                const key = await config.load(cmd.reload);
                const sendConfig = B2C.SendConfig({
                    key,
                    ignore: config.ignore,
                    blurFocus: config.blurFocus,
                });

                switch (cmd.mode) {
                    case "return":
                        return sendConfig;
                    case "allTabs":
                        const tabs = await browser.tabs.query({});
                        await Promise.all(
                            tabs.map(tab => browser.tabs.sendMessage(tab.id, sendConfig))
                        );
                        return;
                    default:
                        exhaustiveCheck(cmd.mode);
                        return sendConfig;
                }
            } catch (_) {
                return await browser.runtime.openOptionsPage();
            }
        case C2B.SUBMIT_QUERY:
            return await setQuery(cmd);
        case BC.SWITCH_TAB:
            return await switchTab(cmd);
        case BC.RELOAD:
            return await reload(cmd);
        case BC.NEW_TAB:
            return await newTab(cmd);
        case BC.CLOSE_TAB:
            return await closeTab(cmd);
        case BC.YANK:
            await browser.tabs.sendMessage(sender.tab.id, yank(sender.tab, cmd));
            return;
        case BC.PASTE:
            return await paste(cmd);
        case BC.GO_UP:
            return await goUp(cmd);
        case BC.RESTORE_TAB:
            return await restoreTab(cmd);
        case BC.START_SEARCH:
            await browser.tabs.sendMessage(sender.tab.id, startSearch(cmd));
            return;
        case BC.SEARCH_JUMP:
            await browser.tabs.sendMessage(sender.tab.id, searchJump(cmd));
            return;
        default:
            exhaustiveCheck(cmd);
            return cmd;
    }
}

browser.runtime.onMessage.addListener<C2B.Messages | BC.Commands, B2C.Messages | void>(dispatch);
