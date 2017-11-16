import { CloseTab } from "../../command/background";

export default async function removeTab({
    dontCloseLastTab,
    dontClosePinnedTab,
}: Options<CloseTab>): Promise<void> {
    if (dontCloseLastTab) {
        const all = await browser.tabs.query({});
        if (all.length === 1) {
            return;
        }
    }
    const [active] = await browser.tabs.query({ active: true });
    if (dontClosePinnedTab && active.pinned) {
        return;
    }
    await browser.tabs.remove(active.id);
}
