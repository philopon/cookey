import { SwitchTab } from "../../command/background";
import { LEFT } from "../../command/direction";
import { clip, euclideanMod } from "../../utils";

export default async function switchTab({ direction, cycle }: Options<SwitchTab>): Promise<void> {
    const [[active], tabs] = await Promise.all([
        browser.tabs.query({ active: true, currentWindow: true }),
        browser.tabs.query({ currentWindow: true }),
    ]);
    const dc = direction === LEFT ? -1 : 1;
    const idx = (cycle === undefined ? true : cycle)
        ? euclideanMod(active.index + dc, tabs.length)
        : clip(active.index + dc, 0, tabs.length);

    await browser.tabs.update(tabs[idx].id, { active: true });
}
