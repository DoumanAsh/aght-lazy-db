"use strict";

const webpack = require('webpack');

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const PUBLIC = path.resolve(__dirname, 'public');
const SRC = path.resolve(__dirname, 'src');

const css_loader = {
    test: /\.sss/,
    use: [
        'css-loader',
        'postcss-loader'
    ]
};

const json_loader = {
    test: /\.json$/,
    loader: 'json5-loader'
};

const img_loader = {
    test: /\.(jpe?g|png|svg|ico)$/,
    loader: 'file-loader',
    options: {
        useRelatievePath: false,
        outputPath: "img/",
        name: '[name].[hash].[ext]',
    },
};

const js_loader = {
    test: /\.jsx?$/,
    use: [
        "babel-loader",
        "eslint-loader"
    ]
};

const pug_loader = {
    test: /\.pug?$/,
    include: path.join(SRC, 'templates'),
    use: [
        'pug-loader'
    ]
};

module.exports.entry = {
    app: `${SRC}/js/init.js`
};

module.exports.output = {
    filename: '[name].js',
    path: PUBLIC
};

module.exports.module = {
    rules: [
        css_loader,
        img_loader,
        json_loader,
        js_loader,
        pug_loader
    ]
};

function html_pug_plug(title, template, name, inject) {
    return new HtmlWebpackPlugin({
        title,
        template: path.join(SRC, template),
        filename: name || "index.html",
        inject: inject
    });
}

function common_chunk(name, minChunks) {
    return new webpack.optimize.CommonsChunkPlugin({
        name,
        minChunks
    })
}

module.exports.plugins = [
    html_pug_plug("AGHT DB", "templates/index.pug", null, true),
    html_pug_plug("Page not found", "templates/404.pug", "404.html", false),
    new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async'
    })
];

module.exports.devServer = {
    port: 3333,
    compress: true
};

module.exports.devtool = "cheap-source-map";
