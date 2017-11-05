import { KeyConfig } from "../config";
import { AllCommands } from "../command";
import { KeyEventOptions } from "../message";

import * as Cmd from "../command";
import * as Dir from "../command/direction";

class Tree<T> {
    public value?: T = undefined;
    public children: { [key: string]: Tree<T> } = {};

    add(keys: string[], value: T): void {
        let current: Tree<T> = this;
        for (const key of keys) {
            const next = current.children[key];
            let child: Tree<T>;
            if (next === undefined) {
                child = new Tree<T>();
                current.children[key] = child;
            } else {
                child = next;
            }
            current = child;
        }
        current.value = value;
    }
}

function isUpperCase(c: string): boolean {
    return /[A-Z]/.test(c);
}

const keyNames: { [key: string]: string } = {
    space: " ",
    esc: "escape",
    "<esc>": "escape",
};

function parseKey(key: string): string[] {
    return key.split(/\s+/).map(k => {
        const modKey = k.split("-");
        const mod = new Set<string>();
        let key: string;

        if (modKey.length === 2) {
            key = modKey[1];
            for (const m of modKey[0].toUpperCase()) {
                mod.add(m);
            }
        } else {
            key = modKey[0];
        }

        if (isUpperCase(key)) {
            mod.add("S");
        }

        key = key.toLowerCase();
        const canKey = keyNames[key];

        return `${Array.from(mod)
            .sort()
            .join("")}\t${canKey || key}`;
    });
}

function encodeKey({ altKey, ctrlKey, metaKey, shiftKey, key }: KeyEventOptions): string {
    const modifiers = [
        altKey ? "A" : "",
        ctrlKey ? "C" : "",
        metaKey ? "M" : "",
        shiftKey ? "S" : "",
    ].join("");
    return `${modifiers}\t${key.toLowerCase()}`;
}

export class KeyFeeder {
    public tree: Tree<AllCommands>;
    public current: Tree<AllCommands>;

    constructor(config: KeyConfig, public timeout: number = 500) {
        this.current = this.tree = new Tree();
        for (const key in config) {
            const keys = parseKey(key);
            this.tree.add(keys, config[key]);
        }
    }

    _feed(key: string): boolean | AllCommands {
        const next = this.current.children[key];
        if (next === undefined) {
            this.reset();
            return false;
        }
        if (Object.keys(next.children).length === 0) {
            this.reset();
            return next.value || false;
        }
        this.current = next;
        return true;
    }

    feed(key: KeyEventOptions): boolean | AllCommands | undefined {
        return this._feed(encodeKey(key));
    }

    reset() {
        this.current = this.tree;
    }
}
