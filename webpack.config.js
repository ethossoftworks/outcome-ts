const path = require("path")

const prodConfig = {
    entry: "./src/Outcome.ts",
    devtool: "source-map",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "Outcome.js",
        path: path.resolve(__dirname, "dist")
    }
}

const testConfig = {
    ...prodConfig,
    ...{
        entry: "./test/Outcome.test.ts",
        mode: "development",
        target: "node",
        output: {
            filename: "Outcome.test.js",
            path: path.resolve(__dirname, "dist")
        }
    }
}

module.exports = env => {
    switch (env) {
        case "prod":
            return prodConfig
        case "test":
            return testConfig
    }
}
