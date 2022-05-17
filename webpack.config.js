const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/js/app.js",
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                options: {
                    compact: true
                }
            },
            {
                test: /\.js$/,
                loader: 'imports-loader?define=>false'
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader',
                ],
            }
        ]
    },
    resolve: {
        modules: ['./src/js', 'node_modules'],
        alias: {
            models: path.resolve(__dirname, 'src/js/models')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'RECAPTCHA_KEY': JSON.stringify(process.env.RECAPTCHA_KEY),
            'SEGMENT_WRITE_KEY': JSON.stringify(process.env.SEGMENT_WRITE_KEY),
        })
    ],
};
