import { NewTabOptions } from "../../command";
import * as Dir from "../../command/direction";
import { exhaustiveCheck } from "../../utils";

export default async function openPage({ address, background, position }: NewTabOptions) {
    const options: browser.tabs.CreateProperties = { url: address, active: !background };
    switch (position) {
        case Dir.LAST:
            break;
        case Dir.FIRST:
            options.index = 0;
            break;
        case Dir.LEFT:
        case Dir.RIGHT:
            const [active] = await browser.tabs.query({ active: true });
            options.index = position === Dir.LEFT ? active.index : active.index + 1;
            break;
        default:
            exhaustiveCheck(position);
    }
    await browser.tabs.create(options);
}
