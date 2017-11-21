import { Yank } from "../../command/background";
import { SetClipboard } from "../../message/background-to-content";
import { sanitize } from "../../utils";

const pattern = /\${(title|fav|fav.url|lastAccessed|url)}/gi;

export default function yank(tab: browser.tabs.Tab, { format }: Options<Yank>): SetClipboard {
    if (!format) {
        format = "${url}";
    }

    function replacer(_: string, matched: string): string {
        matched = matched.toLowerCase();
        switch (matched) {
            case "title":
                return sanitize(tab.title);
            case "fav":
            case "fav.url":
                return tab.favIconUrl;
            case "lastaccessed":
                return tab.lastAccessed.toString();
            case "url":
                return tab.url;
            default:
                return "??";
        }
    }

    const value = format.replace(pattern, replacer);

    return SetClipboard({ value });
}
