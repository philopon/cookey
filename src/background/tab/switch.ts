import { SwitchTabOptions } from "../../command/background";
import { LEFT } from "../../command/direction";
import { clip, euclideanMod } from "../../utils";

export default async function switchTab({
    direction,
    count,
    cycle,
}: SwitchTabOptions): Promise<void> {
    const [[active], tabs] = await Promise.all([
        browser.tabs.query({ active: true }),
        browser.tabs.query({}),
    ]);
    const dc = direction === LEFT ? -count : count;
    const idx = cycle
        ? euclideanMod(active.index + dc, tabs.length)
        : clip(active.index + dc, 0, tabs.length);

    await browser.tabs.update(tabs[idx].id, { active: true });
}
