const {merge} = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: "/assets/js/"
    },
    mode: "development",
    devtool: "eval-source-map"
});
