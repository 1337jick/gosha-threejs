const { merge } = require("webpack-merge");
const config = require("./webpack.config");

module.exports = merge(config, {
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: "/bali/assets/js/",
    },
    mode: "production",
    devtool: false,
});
