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
        for (const key of Object.keys(config)) {
            const keys = parseKey(key);
            tree.add(keys, config[key]);
        }
        return tree;
    }
}

const keyNames: { [key: string]: string } = {
    space: " ",
    esc: "Escape",
    "<esc>": "Escape",
};

const shiftable = new Set([
    "Escape",
    "Tab",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
    " ",
]);

export function parseKey(key: string): string[] {
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

        const canKey = keyNames[key.toLowerCase()];

        return `${Array.from(mod)
            .sort()
            .join("")}${canKey || key}`;
    });
}

export function checkEqualKey(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function encodeKey({ altKey, ctrlKey, shiftKey, metaKey, key }: KeyboardEvent): string {
    const modifiers = [
        altKey ? "A" : "",
        ctrlKey ? "C" : "",
        metaKey ? "M" : "",
        shiftKey && shiftable.has(key) ? "S" : "",
    ].join("");
    return `${modifiers}${key}`;
}

const modifierKeys = new Set(["Control", "Shift", "Meta", "Alt"]);

export function isModifierKey(k: string): boolean {
    return modifierKeys.has(k);
}

export class KeyFeeder {
    public tree: ITree<AllCommands>;
    public current: ITree<AllCommands>;
    public feeded: string[] = [];

    constructor(tree: ITree<AllCommands>) {
        this.current = this.tree = tree;
    }

    _feed(key: string): [boolean | AllCommands, string[]] {
        const next = this.current.children[key];
        this.feeded.push(key);
        if (next === undefined) {
            return [false, this.reset()];
        }
        if (Object.keys(next.children).length === 0) {
            return [next.value || false, this.reset()];
        }
        this.current = next;
        return [true, this.feeded];
    }

    feed(key: KeyboardEvent): [boolean | AllCommands, string[]] {
        return this._feed(encodeKey(key));
    }

    reset(): string[] {
        this.current = this.tree;
        const old = this.feeded;
        this.feeded = [];
        return old;
    }
}
