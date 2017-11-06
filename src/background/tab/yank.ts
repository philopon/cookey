import { YankOptions } from "../../command/background";
import { SetClipboard } from "../../command/content";

export default async function yank(_: YankOptions): Promise<SetClipboard> {
    const [active] = await browser.tabs.query({ active: true });
    return SetClipboard({ value: active.url });
}
