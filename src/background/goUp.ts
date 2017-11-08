import { GoUpOptions } from "../command/background";

function dirname(p: string): string {
    const ps = p.split("/").filter(v => v);
    return ps.slice(0, ps.length - 1).join("/");
}

export default async function goUp({ top }: GoUpOptions): Promise<void> {
    const [active] = await browser.tabs.query({ active: true });
    const url = new URL(active.url);
    url.pathname = top ? "/" : dirname(url.pathname);
    console.log(url);
    await browser.tabs.update(active.id, { url: url.toString() });
}
