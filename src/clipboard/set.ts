function saveRanges(): Range[] {
    const ranges: Range[] = [];
    const selection = window.getSelection();
    for (let i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i));
    }
    return ranges;
}

function restoreRanges(ranges: Range[]): void {
    const selection = window.getSelection();
    selection.removeAllRanges();
    for (const range of ranges) {
        selection.addRange(range);
    }
}

export default function setClipboard(value: string): void {
    const ranges = saveRanges();

    const body = document.body;
    const input = document.createElement("input");
    const button = document.createElement("button");
    input.style.position = "fixed";
    input.style.width = "0";
    input.style.height = "0";
    input.value = value;
    button.style.display = "none";

    body.appendChild(input);
    body.appendChild(button);

    const callback = () => {
        input.select();
        document.execCommand("Copy");
    };

    button.addEventListener("click", callback);
    button.click();

    body.removeChild(input);
    body.removeChild(button);

    restoreRanges(ranges);
}
