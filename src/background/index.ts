import * as BC from "../command/background";
import { AllCommands } from "../command";
import { exhaustiveCheck } from "../utils";
import { Tree } from "../key";
import * as B2C from "../message/backend-to-content";
import * as C2B from "../message/content-to-backend";

import switchTab from "./tab/switch";
import newTab from "./tab/new";
import closeTab from "./tab/close";
import reload from "./reload";
import yank from "./tab/yank";
import paste from "./tab/paste";
import toml from "toml";

let keyConfig: Tree<AllCommands>;
let doBlurFocus: boolean = false;

async function getDefaultConfig(): Promise<string> {
    const response = await fetch(browser.runtime.getURL("config.toml"));
    return await response.text();
}

async function parseConfig(config: string): Promise<any> {
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
}

async function dispatchCommand(
    cmd: BC.Commands | C2B.Messages
): Promise<B2C.Responses | B2C.SendConfig | void> {
    switch (cmd.type) {
        case C2B.PULL_CONFIG:
            await loadConfig();
            return B2C.SendConfig({ key: keyConfig });
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

browser.tabs.onUpdated.addListener(async (tabId, event) => {
    switch (event.status) {
        case "complete":
        case "loading":
            if (doBlurFocus) {
                await loadConfig();
                return await blurFocus(tabId);
            }
    }
});

browser.runtime.onMessage.addListener<
    C2B.Messages | BC.Commands,
    B2C.Responses | B2C.SendConfig | void
>(dispatchCommand);
