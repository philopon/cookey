import { Yank } from "../../command/background";
import { SetClipboard } from "../../message/background-to-content";
import { sanitize } from "../../utils";

const pattern = /\${(title|fav|fav.url|lastAccessed|url)}/gi;

export default async function yank({ format }: Options<Yank>): Promise<SetClipboard> {
    if (!format) {
        format = "{{{url}}}";
    }

    const [active] = await browser.tabs.query({ active: true });

    function replacer(_: string, matched: string): string {
        matched = matched.toLowerCase();
        switch (matched) {
            case "title":
                return sanitize(active.title);
            case "fav":
            case "fav.url":
                return active.favIconUrl;
            case "lastaccessed":
                return active.lastAccessed.toString();
            case "url":
                return active.url;
            default:
                return "??";
        }
    }

    const value = format.replace(pattern, replacer);

    return SetClipboard({ value });
}
