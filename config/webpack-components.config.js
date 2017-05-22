var path = require('path');
var webpack = require('webpack');
var pluginList = [];

// For now force to production
process.env.NODE_ENV = "production"

if (process.env.NODE_ENV === 'production') {
  console.log('==> Production build');
  pluginList.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }));
}

module.exports = {
  plugins: pluginList,
  entry: './src/components/',
  output: {
    libraryTarget: 'umd',
    path: './build',
    filename: 'mongochemclient.js',
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: function(modulePath) {
          return /node_modules/.test(modulePath) &&
                 !/node_modules\/mongochemclient/.test(modulePath);
        },
        query: {
          env: {
            production: {
              presets: ["es2015", "react"]
            }
          }
        }
    },
    {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
    }]
  },
  postcss: [
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
  ],
  eslint: {
    configFile: '.eslintrc.js',
  },
};
