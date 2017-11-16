import { RestoreTab } from "../../command/background";

export default async function restoreTab({  }: Options<RestoreTab>): Promise<void> {
    const results = await browser.sessions.getRecentlyClosed({ maxResults: 1 });
    if (results.length > 0) {
        await browser.sessions.restore(results[0].tab.sessionId);
    }
}
