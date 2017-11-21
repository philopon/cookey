import { Reload } from "../command/background";

export default async function reload({ bypassCache }: Options<Reload>): Promise<void> {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    await browser.tabs.reload(tab.id, { bypassCache: bypassCache || false });
}
