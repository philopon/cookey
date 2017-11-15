import { AllCommands } from "../command";
import { Tree, parseKey } from "../key";
import { Config } from "../config";

import toml from "toml";

export class ConfigManager {
    public key?: Tree<AllCommands>;
    public blurFocus: boolean = false;
    public ignore: { [key: string]: string[][] } = {};

    async load(reload: boolean = false): Promise<Tree<AllCommands>> {
        if (!reload && this.key) {
            return this.key;
        }
        const config = await loadConfigString();
        const parsed = await parseConfig(config);
        this.blurFocus = parsed.blurFocus;
        this.key = Tree.compile(parsed.key);
        this.ignore = {};
        for (const key of Object.keys(parsed.ignore || {})) {
            this.ignore[key] = parsed.ignore[key].map(k => parseKey(k));
        }
        return this.key;
    }
}

export async function getDefaultConfigString(): Promise<string> {
    const response = await fetch(browser.runtime.getURL("config.toml"));
    return await response.text();
}

export async function loadConfigString(): Promise<string> {
    const { config } = await browser.storage.sync.get<string>("config");
    if (config === undefined) {
        return await getDefaultConfigString();
    }
    return config;
}

export async function parseConfig(config: string): Promise<Config> {
    return toml.parse(config);
}
