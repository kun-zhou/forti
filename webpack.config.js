const path = require('path')
const Copy = require('copy-webpack-plugin');

module.exports = {
    target: 'electron-renderer',
    entry: {
        app: path.join(__dirname, 'lib', 'index.js')
    },
    output: {
        path: path.join(__dirname, 'app', 'render'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$|\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                },
                include: path.join(__dirname, 'lib')
            },
            // Load Global CSS Modules
            {
                test: /\.cssm$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true, // default is false
                            localIdentName: '[local]-[hash:base64:5]'
                        }
                    },
                ]
            },
            // Load Global CSS
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
            },
            // Load fonts
            {
                test: /\.woff2?/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]'
                }
            }
        ],
    },
    resolve: {
        alias: {
            actions: path.resolve(__dirname, 'lib/actions'),
            reducers: path.resolve(__dirname, 'lib/reducers'),
            public: path.resolve(__dirname, 'lib/public')
        }
    },
    plugins: [
        new Copy([
            {
                from: './assets',
                to: './assets'
            }
        ])
    ],
}