import typescript from "rollup-plugin-typescript";
import tsc from "typescript";

function makeEntry(entry) {
    return {
        entry: "src/" + entry + "/index.ts",
        plugins: [typescript({ typescript: tsc })],
        output: {
            file: "dist/js/" + entry + ".js",
            format: "cjs",
        },
    };
}

export default [makeEntry("background"), makeEntry("content")];
