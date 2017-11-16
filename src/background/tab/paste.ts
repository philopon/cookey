import { NewTab, PasteOptions } from "../../command/background";
import getClipboard from "../../clipboard/get";
import newTab from "./new";

export default async function paste(args: PasteOptions): Promise<void> {
    const url = getClipboard();
    if (args.newTab) {
        const opts: Options<NewTab> = Object.assign({}, args, { url });
        await newTab(opts);
    } else {
        const [active] = await browser.tabs.query({ active: true });
        await browser.tabs.update(active.id, { url });
    }
}
