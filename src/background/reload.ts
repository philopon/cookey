import * as Cmd from "../command";

export default async function reload({ bypassCache }: Cmd.ReloadOptions) {
    const [tab] = await browser.tabs.query({ active: true });
    console.log(await browser.tabs.reload(tab.id, { bypassCache }));
}
