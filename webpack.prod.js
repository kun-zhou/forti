const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')

var baseConfig = require('./webpack.config.js')

module.exports = merge(baseConfig,{
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
})