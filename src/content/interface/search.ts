import windowFind from "../../patch/window-find";
import { SubmitQuery } from "../../message/content-to-background";

export default class Searchbox {
    private iframe: HTMLIFrameElement;
    private wrapper: HTMLDivElement;
    private input: HTMLDivElement;

    private loaded: boolean = false;
    private prevent: boolean = false;
    private caseSensitive: boolean = false;

    constructor() {
        const iframe = (this.iframe = document.createElement("iframe"));
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.bottom = "0";
        iframe.style.right = "0";
        iframe.style.width = "100%";
        iframe.style.zIndex = "9999";
    }

    async onkeydown(event: KeyboardEvent): Promise<void> {
        const { key, ctrlKey, altKey, metaKey } = event;
        if (key === "Escape") {
            event.preventDefault();
            this.hide();
        } else if (!ctrlKey && !altKey && !metaKey && key === "Enter") {
            event.preventDefault();
            await browser.runtime.sendMessage(SubmitQuery(this.value));
            this.hide();
        } else if (event.key === "Backspace" && this.value.length === 0) {
            event.preventDefault();
            await browser.runtime.sendMessage(SubmitQuery(""));
            this.hide();
        }
    }

    onkeyup(_: KeyboardEvent): void {
        setTimeout(() => {
            const selection = getSelection();
            selection.removeAllRanges();
            this.prevent = true;
            this.value.length > 0 && windowFind(this.value, this.caseSensitive);
            this.iframe.focus();
            this.prevent = false;
        });
    }

    onpaste(event: ClipboardEvent): void {
        event.preventDefault();
        const value = event.clipboardData.getData("Text");
        this.value = value.split("\n").join(" ");
    }

    onLoad(resolve: () => void): void {
        const child = this.iframe.contentWindow.document;
        this.wrapper = child.body.querySelector(".wrapper") as HTMLDivElement;
        this.input = child.body.querySelector(".input") as HTMLDivElement;

        this.input.addEventListener("blur", () => this.prevent || this.hide());
        this.input.addEventListener("keydown", event => this.onkeydown(event));
        this.input.addEventListener("keyup", event => this.onkeyup(event));
        this.input.addEventListener("paste", event => this.onpaste(event));

        this.iframe.style.height = `${this.wrapper.clientHeight + 1}px`;
        resolve();
    }

    load(): Promise<void> {
        return new Promise(async resolve => {
            const html = await browser.runtime.getURL("html/search-box.html");
            this.iframe.src = html;
            this.iframe.addEventListener("load", () => this.onLoad(resolve));
            document.body.appendChild(this.iframe);
        });
    }

    async show(value: string = "", caseSensitive: boolean = false): Promise<void> {
        if (!this.loaded) {
            await this.load();
        }
        this.iframe.style.visibility = "visible";
        this.caseSensitive = caseSensitive;
        this.input.innerText = value;
        this.input.focus();
        this.iframe.contentWindow.document.execCommand("selectAll", false, null);
    }

    hide(): void {
        this.iframe.blur();
        this.iframe.style.visibility = "hidden";
    }

    set value(s: string) {
        this.input.innerText = s;
    }

    get value(): string {
        return this.input.innerText.trim();
    }
}
