import { RemoveTabOptions } from "../../command";

export default async function removeTab({ dontCloseLastTab }: RemoveTabOptions) {
    if (dontCloseLastTab) {
        const all = await browser.tabs.query({});
        if (all.length === 1) {
            return;
        }
    }
    const [active] = await browser.tabs.query({ active: true });
    await browser.tabs.remove(active.id);
}
