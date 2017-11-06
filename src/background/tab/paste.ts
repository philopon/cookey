import { NewTabOptions, PasteOptions } from "../../command/background";
import get_clipboard from "../get_clipboard";
import newTab from "./new";

export default async function paste(args: PasteOptions): Promise<void> {
    const address = get_clipboard();
    if (args.newTab) {
        const opts: NewTabOptions = Object.assign({}, args, { address });
        await newTab(opts);
    } else {
        const [active] = await browser.tabs.query({ active: true });
        await browser.tabs.update(active.id, { url: address });
    }
}
