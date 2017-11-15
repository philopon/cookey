import windowFind from "../../patch/window-find";
import { SubmitQuery } from "../../message/content-to-background";

export default class Searchbox {
    private iframe: HTMLIFrameElement;
    private wrapper: HTMLDivElement;
    private input: HTMLDivElement;
    private resolves: Array<() => void> = [];
    private prevent: boolean = false;
    private valueToSet: string = "";
    private caseSensitive: boolean = false;

    constructor() {
        const iframe = (this.iframe = document.createElement("iframe"));
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.bottom = "0";
        iframe.style.right = "0";
        iframe.style.width = "100%";
        iframe.style.zIndex = "9999";
        iframe.addEventListener("load", () => this.onLoad());
    }

    onkeydown(event: KeyboardEvent) {
        const { key, ctrlKey, altKey, metaKey } = event;
        if (key === "Escape") {
            event.preventDefault();
            this.hide();
        } else if (!ctrlKey && !altKey && !metaKey && key === "Enter") {
            event.preventDefault();
            browser.runtime.sendMessage(SubmitQuery(this.value));
            this.hide();
        }
    }

    onkeyup(_event: KeyboardEvent) {
        setTimeout(() => {
            const selection = getSelection();
            selection.removeAllRanges();
            this.prevent = true;
            windowFind(this.value, this.caseSensitive);
            this.iframe.focus();
            this.prevent = false;
        });
    }

    onLoad() {
        const child = this.iframe.contentWindow.document;
        this.wrapper = child.body.querySelector(".wrapper") as HTMLDivElement;
        this.input = child.body.querySelector(".input") as HTMLDivElement;
        this.input.innerText = this.valueToSet;
        this.input.addEventListener("blur", () => this.prevent || this.hide());
        this.input.addEventListener("keydown", event => this.onkeydown(event));
        this.input.addEventListener("keyup", event => this.onkeyup(event));

        this.input.addEventListener("paste", event => {
            event.preventDefault();
            const value = event.clipboardData.getData("Text");
            this.value = value.split("\n").join(" ");
        });

        this.iframe.style.height = `${this.wrapper.clientHeight + 1}px`;
        this.input.focus();
        while (true) {
            const resolve = this.resolves.pop();
            if (resolve === undefined) {
                break;
            }
            resolve();
        }
        child.execCommand("selectAll", false, null);
    }

    show(value: string = "", caseSensitive: boolean = false) {
        this.caseSensitive = caseSensitive;
        return new Promise(async resolve => {
            this.valueToSet = value;
            const html = await browser.runtime.getURL("html/search-box.html");
            this.iframe.src = html;
            this.resolves.push(resolve);
            document.body.appendChild(this.iframe);
        });
    }

    hide() {
        if (this.iframe.parentNode) {
            document.body.removeChild(this.iframe);
        }
    }

    set value(s: string) {
        this.input.innerText = s;
    }

    get value(): string {
        return this.input.innerText.trim();
    }
}
