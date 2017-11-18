import windowFind from "../../patch/window-find";
import { SubmitQuery } from "../../message/content-to-background";

export default class Searchbox {
    private iframeElement: HTMLIFrameElement;
    private wrapperElement: HTMLDivElement;
    private inputElement: HTMLDivElement;
    private infoElement: HTMLDivElement;

    private loaded: boolean = false;
    private prevent: boolean = false;
    private caseSensitive: boolean = false;

    constructor() {
        const iframe = (this.iframeElement = document.createElement("iframe"));
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
            if (this.value.length <= 0) {
                return;
            }

            const selection = getSelection();
            selection.removeAllRanges();
            this.prevent = true;
            const found = windowFind(this.value, this.caseSensitive);
            this.info = found ? "" : "(not found)";
            this.iframeElement.focus();
            this.prevent = false;
        });
    }

    onpaste(event: ClipboardEvent): void {
        event.preventDefault();
        const value = event.clipboardData.getData("Text");
        this.value = value.split("\n").join(" ");
    }

    onLoad(resolve: () => void): void {
        const child = this.iframeElement.contentWindow.document;
        this.wrapperElement = child.body.querySelector(".wrapper") as HTMLDivElement;
        this.inputElement = child.body.querySelector(".input") as HTMLDivElement;
        this.infoElement = child.body.querySelector(".info") as HTMLDivElement;

        this.inputElement.addEventListener("blur", () => this.prevent || this.hide());
        this.inputElement.addEventListener("keydown", event => this.onkeydown(event));
        this.inputElement.addEventListener("keyup", event => this.onkeyup(event));
        this.inputElement.addEventListener("paste", event => this.onpaste(event));

        this.iframeElement.style.height = `${this.wrapperElement.clientHeight + 1}px`;
        this.loaded = true;
        resolve();
    }

    load(): Promise<void> {
        return new Promise(async resolve => {
            const html = await browser.runtime.getURL("html/search-box.html");
            this.iframeElement.src = html;
            this.iframeElement.addEventListener("load", () => this.onLoad(resolve));
            document.body.appendChild(this.iframeElement);
        });
    }

    async show(value: string = "", caseSensitive: boolean = false): Promise<void> {
        if (!this.loaded) {
            await this.load();
        }
        this.iframeElement.style.display = "";
        this.caseSensitive = caseSensitive;
        this.inputElement.innerText = value;
        this.inputElement.focus();
        this.iframeElement.contentWindow.document.execCommand("selectAll", false, null);
    }

    hide(): void {
        this.iframeElement.blur();
        this.iframeElement.style.display = "none";
    }

    set value(s: string) {
        this.inputElement.innerText = s;
    }

    get value(): string {
        return this.inputElement.innerText.trim();
    }

    set info(s: string) {
        this.infoElement.innerText = s;
    }
}
