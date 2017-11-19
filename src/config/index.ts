import { AllCommands } from "../command";
import { Tree, parseKey } from "../key";
import { Config } from "./types";
import schema from "./schema";

import yaml from "js-yaml";
import { Validator, ValidationError } from "jsonschema";

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
    const response = await fetch(browser.runtime.getURL("config.yaml"));
    return await response.text();
}

export async function loadConfigString(): Promise<string> {
    const { config } = await browser.storage.sync.get<string>("config");
    if (config === undefined) {
        return await getDefaultConfigString();
    }
    return config;
}

const validator = new Validator();

export class ValidationFailed {
    constructor(public errors: ValidationError[]) {}
}

export async function parseConfig(config: string): Promise<Config> {
    const obj = yaml.safeLoad<Config>(config);
    const errors = validator.validate(obj, schema).errors;
    if (errors.length > 0) {
        throw new ValidationFailed(errors);
    }
    return obj;
}
