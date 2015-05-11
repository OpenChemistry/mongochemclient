var webpack = require('webpack');
var path = require('path')
var glob = require('glob');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var fs = require('fs');

appRoot = path.join(__dirname, 'app');

/**
 * Function to extract out any file paths referenced by requires(...)
 *
 */
function extractRoutes() {
    var lines = fs.readFileSync(path.join(appRoot, 'app.routes.js')).toString().split("\n");

    var requires = lines.map(function(item) {
        var match = item.match(/^\s*templateUrl:\s*require\(['"](.*)['"]\).*$/);
        if (match) {
            return match[1];
        }
    });

    return requires.filter(function(e) { return e != undefined });
}

/**
 * Function to generate the appropriate query parameter to pass to baggage loader
 */
function generateBaggageQueryRoutes() {
    var paths = extractRoutes()

    return paths.join('&');
}

module.exports = {
    entry: glob.sync(appRoot + '/**/*.js'),
    resolve: {
        alias: {
            style: path.join(__dirname, 'assets/style')
        }
    },
    devtool: 'sourcemap',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /3Dmol.js$/, loader: '3dmol-patch'},
            { test: /directive\.js$/, loader: 'baggage?[dir].view.html' },
            { test: /directive\.js$/, loader: 'baggage?[dir].view.jade' },
            { test: /\.js$/, loader: 'baggage?[file].html' },
            { test: /\.js$/, loader: 'baggage?[file].jade' },
            { test: /app\.routes\.js$/, loader: 'baggage?' + generateBaggageQueryRoutes()},
            { test: /\.js$/,
              exclude: /node_modules/,
              loader: "jshint-loader"
            }
        ],
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.html$/, loader: 'ngtemplate?relativeTo=' + __dirname + '!html' },
            { test: /\.jade$/, loader: 'ngtemplate?relativeTo=' + __dirname + '!html!jade-html-loader' },
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
        ]
    },
    jshint: {
        emitErrors: false,
        failOnHint: false,
        curly: true,
        unused: true,
        esnext: true
    },
    plugins: [
        new ngAnnotatePlugin({
            add: true,
        })
    ]
};
