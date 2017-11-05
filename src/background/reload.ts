import { ReloadOptions } from "../command";

export default async function reload({ bypassCache }: ReloadOptions) {
    const [tab] = await browser.tabs.query({ active: true });
    await browser.tabs.reload(tab.id, { bypassCache });
}
