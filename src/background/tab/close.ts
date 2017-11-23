import { CloseTab } from "../../command/background";

export default async function removeTab({
    dontCloseLastTab,
    dontClosePinnedTab,
}: Options<CloseTab>): Promise<void> {
    if (dontCloseLastTab) {
        const all = await browser.tabs.query({ currentWindow: true });
        if (all.length === 1) {
            if (typeof dontCloseLastTab === "string") {
                await browser.tabs.create({ active: true, url: dontCloseLastTab });
                await browser.tabs.remove(all[0].id);
            }
            return;
        }
    }
    const [active] = await browser.tabs.query({ active: true, currentWindow: true });
    if (dontClosePinnedTab && active.pinned) {
        return;
    }
    await browser.tabs.remove(active.id);
}
