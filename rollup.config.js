import typescript from "rollup-plugin-typescript";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import yaml from "rollup-plugin-yaml";

import tsc from "typescript";

function makeEntry(src, dst) {
    const plugins = [
        yaml(),
        nodeResolve({ main: true, preferBuiltins: false }),
        commonjs(),
        typescript({ typescript: tsc }),
    ];

    return {
        entry: "src/" + src,
        plugins,
        output: {
            file: "dist/js/" + dst,
            format: "cjs",
        },
    };
}

export default [
    makeEntry("background/index.ts", "background.js"),
    makeEntry("content/index.ts", "content.js"),
    makeEntry("config/page.ts", "options.js"),
];
