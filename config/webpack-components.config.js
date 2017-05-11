var path = require('path');
var webpack = require('webpack');
var pluginList = [];

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
        exclude: function(modulePath) {
          return /node_modules/.test(modulePath) &&
                 !/node_modules\/mongochemclient/.test(modulePath);
        },
        loader: `babel-loader?presets[]=es2015,presets[]=react`,
    }]
  },
  postcss: [
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
  ],
  eslint: {
    configFile: '.eslintrc.js',
  },
};
