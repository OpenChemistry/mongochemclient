var webpack = require('webpack');
var path = require('path')
var glob = require('glob');

// This is required to init the baggage-loader
require('baggage-loader')

appRoot = path.join(__dirname, 'app');

module.exports = {
    entry: glob.sync(appRoot + '/**/*.js'),
    resolve: {
        alias: {style: path.join(__dirname, 'assets/style')}
    },
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'baggage?[file].html' }
        ],
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.html$/, loader: 'ngtemplate?relativeTo=' + __dirname + '/!html' },
            { test: /\.jade$/, loader: 'ngtemplate?relativeTo=' + __dirname + '/!html!jade-html-loader' },
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    }
};
