export default function set_clipboard(value: string) {
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
}
