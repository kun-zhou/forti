var baseConfig = require('./webpack.config.js')
const merge = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
    plugins: [new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('dev')
    })]
})
