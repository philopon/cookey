module.exports = {
    entry: {
        background: __dirname + "/src/background.ts",
        content: __dirname + "/src/content.ts",
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [{ test: /\.ts$/, use: "ts-loader" }],
    },
};
