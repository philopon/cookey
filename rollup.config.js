import typescript from "rollup-plugin-typescript";
import tsc from "typescript";
import postcss from "rollup-plugin-postcss";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

import sass from "node-sass";
import postcssModules from "postcss-modules";
import cssnano from "cssnano";
import crypto from "crypto";
import BaseX from "base-x";

import manifest from "./dist/manifest.json";

const base62 = BaseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

function preprocessor(content, id) {
    return new Promise((resolve, reject) => {
        sass.render({ file: id }, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ code: result.css.toString() });
        });
    });
}

const cssExportMap = {};
function makeEntry(src, dst, style = false) {
    const plugins = [nodeResolve({ main: true }), commonjs(), typescript({ typescript: tsc })];
    if (style) {
        plugins.push(
            postcss({
                preprocessor,
                extensions: [".scss"],
                plugins: [
                    cssnano(),
                    postcssModules({
                        getJSON(id, exportTokens) {
                            cssExportMap[id] = exportTokens;
                        },
                        generateScopedName(name, filename, css) {
                            const hash = base62
                                .encode(crypto.createHmac("sha256", filename + "/" + name).digest())
                                .slice(0, 8);
                            return `${manifest.name}_${name}_${hash}`;
                        },
                    }),
                ],
                getExportNamed: true,
                getExport(id) {
                    return cssExportMap[id];
                },
            })
        );
    }
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
