const path = require('path')
module.exports = {
    target: 'electron-renderer',
    entry: {
        app: path.join(__dirname, 'src', 'index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$|.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                },
                include: path.join(__dirname, 'src')
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
                            localIdentName: '[name]-[local]-[hash:base64:4]'
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
            actions: path.resolve(__dirname, 'src/actions'),
            reducers: path.resolve(__dirname, 'src/reducers/'),
        }
    }
}