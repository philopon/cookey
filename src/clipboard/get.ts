const textarea = document.createElement("textarea");
const button = document.createElement("button");

textarea.contentEditable = "true";

document.body.appendChild(textarea);
document.body.appendChild(button);

const callback = () => {
    textarea.textContent = null;
    textarea.focus();
    document.execCommand("Paste");
};

button.addEventListener("click", callback);

export default function getClipboard(): string {
    button.click();
    return textarea.textContent || "";
}
