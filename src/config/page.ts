import { getDefaultConfigString, loadConfigString, parseConfig, ValidationFailed } from ".";
import { LoadConfig } from "../message/content-to-background";
import { ValidationError } from "jsonschema";
import yaml from "js-yaml";

import {} from "monaco-editor"; // load type declaration

function createCell(text: string, ...classes: string[]) {
    const cell = document.createElement("span");
    for (const cls of classes) {
        cell.classList.add(cls);
    }
    cell.innerText = text;
    return cell;
}

function createYamlErrorElement(e: yaml.YAMLException) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("error");
    wrapper.classList.add("yaml");

    wrapper.appendChild(createCell(e.name, "category"));
    wrapper.appendChild(createCell(e.mark.line.toString(), "line"));
    wrapper.appendChild(createCell(e.mark.column.toString(), "column"));
    wrapper.appendChild(createCell(e.reason, "message"));

    return wrapper;
}

function createValidationErrorElement(e: ValidationError) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("error");
    wrapper.classList.add("validation");

    wrapper.appendChild(createCell("ValidationError", "category"));
    wrapper.appendChild(
        createCell(
            e.property
                .split(".")
                .slice(1)
                .join("."),
            "instance"
        )
    );
    wrapper.appendChild(createCell(e.message, "message"));

    return wrapper;
}

async function main() {
    const config = document.querySelector<HTMLElement>(".config");
    if (!config) {
        return;
    }
    const editor = monaco.editor.create(config, {
        value: await loadConfigString(),
        language: "yaml",
    });

    const reset = document.querySelector<HTMLButtonElement>(".reset");
    if (!reset) {
        throw Error("no .reset element");
    }
    const form = document.querySelector<HTMLButtonElement>("form");
    if (!form) {
        throw Error("no form element");
    }
    const errors = document.querySelector<HTMLDivElement>(".errors");
    if (!errors) {
        throw Error("no .errors element");
    }

    const save = async () => {
        const text = editor.getValue() || "";
        while (errors.firstChild) {
            errors.removeChild(errors.firstChild);
        }

        try {
            await parseConfig(text);
        } catch (e) {
            if (e instanceof yaml.YAMLException) {
                console.log(e);
                errors.appendChild(createYamlErrorElement(e));
            } else if (e instanceof ValidationFailed) {
                for (const error of e.errors) {
                    errors.appendChild(createValidationErrorElement(error));
                }
            }
            return;
        }

        await browser.storage.sync.set({ config: text });
        await browser.runtime.sendMessage(LoadConfig({ force: true }));
    };

    config.addEventListener("keypress", event => {
        const { ctrlKey, metaKey, key } = event;
        if ((ctrlKey || metaKey) && key === "s") {
            event.preventDefault();
            save();
        }
    });

    reset.addEventListener("click", async () => {
        editor.setValue(await getDefaultConfigString());
    });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        save();
    });

    window.addEventListener("resize", () => {
        editor.layout();
    });
}

(require as any).config({ paths: { vs: "/js/vs" } });
(require as any)(["vs/editor/editor.main"], () => main());
