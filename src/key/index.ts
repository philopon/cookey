import { AllCommands } from "../command";

export interface ITree<T> {
    value?: T;
    children: { [key: string]: ITree<T> };
}

export class Tree<T> {
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

    static compile<T>(config: { [key: string]: T }): Tree<T> {
        const tree = new Tree<T>();
        for (const key in config) {
            const keys = parseKey(key);
            tree.add(keys, config[key]);
        }
        return tree;
    }
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

        const canKey = keyNames[key];

        return `${Array.from(mod)
            .sort()
            .join("")}${canKey || key}`;
    });
}

function encodeKey({ altKey, ctrlKey, metaKey, key }: KeyboardEvent): string {
    const modifiers = [altKey ? "A" : "", ctrlKey ? "C" : "", metaKey ? "M" : ""].join("");
    return `${modifiers}${key}`;
}

const modifierKeys = new Set(["Control", "Shift", "Meta", "Alt"]);

export function isModifierKey(k: string): boolean {
    return modifierKeys.has(k);
}

export class KeyFeeder {
    public tree: ITree<AllCommands>;
    public current: ITree<AllCommands>;

    constructor(tree: ITree<AllCommands>) {
        this.current = this.tree = tree;
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

    feed(key: KeyboardEvent): boolean | AllCommands {
        return this._feed(encodeKey(key));
    }

    reset(): void {
        this.current = this.tree;
    }
}
