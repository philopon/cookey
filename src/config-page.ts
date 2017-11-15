import { getDefaultConfigString, loadConfigString } from "./background/config";
import { ReloadConfig } from "./message/content-to-background";

(async () => {
    const config = document.querySelector<HTMLTextAreaElement>(".config");
    if (!config) {
        throw Error("no .config element");
    }
    const reset = document.querySelector<HTMLButtonElement>(".reset");
    if (!reset) {
        throw Error("no .reset element");
    }
    const form = document.querySelector<HTMLButtonElement>("form");
    if (!form) {
        throw Error("no form element");
    }

    const save = async () => {
        const text = config.value || "";
        await browser.storage.sync.set({ config: text });
        await browser.runtime.sendMessage(ReloadConfig());
    };

    config.value = await loadConfigString();
    config.addEventListener("keypress", event => {
        const { ctrlKey, metaKey, key } = event;
        if ((ctrlKey || metaKey) && key === "s") {
            event.preventDefault();
            save();
        }
    });

    reset.addEventListener("click", async () => {
        config.value = await getDefaultConfigString();
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        save();
    });
})();
