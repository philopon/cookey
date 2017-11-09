import { ReloadOptions } from "../command/background";

export default async function reload({ bypassCache }: ReloadOptions): Promise<void> {
    const [tab] = await browser.tabs.query({ active: true });
    await browser.tabs.reload(tab.id, { bypassCache: bypassCache || false });
}
