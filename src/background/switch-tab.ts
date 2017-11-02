import * as Cmd from "../command";
import { clip, euclideanMod } from "../utils";

export default async function switchTab({ direction, count, cycle }: Cmd.SwitchTabOptions) {
    const [[active], tabs] = await Promise.all([
        browser.tabs.query({ active: true }),
        browser.tabs.query({}),
    ]);
    const dc = direction === Cmd.LEFT ? -count : count;
    const idx = cycle
        ? euclideanMod(active.index + dc, tabs.length)
        : clip(active.index + dc, 0, tabs.length);

    await browser.tabs.update(tabs[idx].id, { active: true });
}
