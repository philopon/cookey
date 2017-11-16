import { NewTab } from "../../command/background";
import { LEFT, RIGHT, FIRST, LAST } from "../../command/direction";
import { exhaustiveCheck } from "../../utils";

export default async function openPage({
    url,
    background,
    position,
}: Options<NewTab>): Promise<void> {
    const options: browser.tabs.CreateProperties = { url, active: !background };
    switch (position) {
        case LAST:
        case undefined:
            break;
        case FIRST:
            options.index = 0;
            break;
        case LEFT:
        case RIGHT:
            const [active] = await browser.tabs.query({ active: true });
            options.index = position === LEFT ? active.index : active.index + 1;
            break;
        default:
            exhaustiveCheck(position);
    }
    await browser.tabs.create(options);
}
