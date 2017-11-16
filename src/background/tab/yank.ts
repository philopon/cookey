import { Yank } from "../../command/background";
import { SetClipboard } from "../../message/background-to-content";

export default async function yank(_: Options<Yank>): Promise<SetClipboard> {
    const [active] = await browser.tabs.query({ active: true });
    return SetClipboard({ value: active.url });
}
