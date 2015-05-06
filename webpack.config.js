var webpack = require('webpack');
var path = require('path')
var glob = require('glob');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin')

// This is required to init the baggage-loader
require('baggage-loader')

appRoot = path.join(__dirname, 'app');

module.exports = {
    entry: glob.sync(appRoot + '/**/*.js'),
    resolve: {
        alias: {style: path.join(__dirname, 'assets/style')}
    },
    devtool: 'sourcemap',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /3Dmol.js$/, loader: '3dmol-patch'},
            { test: /\.js$/, loader: 'baggage?[file].html' },
            { test: /\.js$/,
              exclude: /node_modules/,
              loader: "jshint-loader"
            }
        ],
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.html$/, loader: 'ngtemplate?relativeTo=' + __dirname + '/!html' },
            { test: /\.jade$/, loader: 'ngtemplate?relativeTo=' + __dirname + '/!html!jade-html-loader' },
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    },
    jshint: {
        emitErrors: false,
        failOnHint: false,
        curly: true,
        unused: true
    },
    plugins: [
        new ngAnnotatePlugin({
            add: true,
        })
    ]
};
