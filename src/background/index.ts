import * as BC from "../command/background";
import { AllCommands } from "../command";
import { exhaustiveCheck } from "../utils";
import { Tree, parseKey } from "../key";
import { Config } from "../config";
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

import toml from "toml";

let keyConfig: Tree<AllCommands>;
let doBlurFocus: boolean = false;
let ignore: { [key: string]: string[][] };

async function getDefaultConfig(): Promise<string> {
    const response = await fetch(browser.runtime.getURL("config.toml"));
    return await response.text();
}

async function parseConfig(config: string): Promise<Config> {
    return toml.parse(config);
}

(async function() {
    const config = await getDefaultConfig();
    await browser.storage.local.set({ config });
})();

async function loadConfig(reload: boolean = false): Promise<void> {
    if (!reload && keyConfig) {
        return;
    }
    const { config } = await browser.storage.local.get<string>("config");
    const parsed = await parseConfig(config);
    doBlurFocus = parsed.blurFocus;
    keyConfig = Tree.compile(parsed.key);
    ignore = {};
    for (const key of Object.keys(parsed.ignore || {})) {
        ignore[key] = parsed.ignore[key].map(k => parseKey(k));
    }
}

async function dispatch(cmd: BC.Commands | C2B.Messages): Promise<B2C.Messages | void> {
    switch (cmd.type) {
        case C2B.PULL_CONFIG:
            await loadConfig();
            return B2C.SendConfig({ key: keyConfig, ignore, blurFocus: doBlurFocus });
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
            return await yank(cmd);
        case BC.PASTE:
            return await paste(cmd);
        case BC.GO_UP:
            return await goUp(cmd);
        case BC.RESTORE_TAB:
            return await restoreTab(cmd);
        case BC.START_SEARCH:
            return await startSearch(cmd);
        case BC.SEARCH_JUMP:
            return await searchJump(cmd);
        default:
            exhaustiveCheck(cmd);
            return cmd;
    }
}

browser.runtime.onMessage.addListener<C2B.Messages | BC.Commands, B2C.Messages | void>(dispatch);
