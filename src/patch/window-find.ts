export default function find(
    query: string,
    caseSensitive?: boolean,
    backwards?: boolean,
    wrapAround?: boolean
): boolean {
    const find = () => (window as any).find(query, caseSensitive, backwards);

    if (wrapAround) {
        const found = find();
        if (!found) {
            const selection = getSelection();
            const selected = selection.rangeCount ? selection.getRangeAt(0) : undefined;
            selection.removeAllRanges();
            const found = find();
            if (!found && selected) {
                selection.addRange(selected);
            }
            return found;
        } else {
            return true;
        }
    } else {
        return find();
    }
}
