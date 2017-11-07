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
  externals: {
    // Use external version of React
    "react": "react",
    'react-dom': 'react-dom',
    'react-router': 'react-router',
    'jsonpath': true,
  },
  entry: ['./src/lib.js'],
  output: {
    libraryTarget: 'umd',
    path: './build',
    filename: 'mongochemclient.js',
  },
  resolveLoader: {
    root: [
        path.join(__dirname, '../node_modules')
    ]
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
              presets: ["es2016", "react"],
              plugins: ["lodash"]
            }
          }
        }
    },
    {
        test: /\.css$/,
        exclude: function(modulePath) {
          return /node_modules/.test(modulePath) &&
                 !/node_modules\/mongochemclient/.test(modulePath) &&
                 !/node_modules\/font-awesome/.test(modulePath);
        },
        loaders: [ 'style-loader', 'css-loader' ]
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=60000&mimetype=application/font-woff',
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
     loader: 'url-loader?limit=60000',
     include: /fonts/,
    },

   {
      test: /\.mcss$/,
      loader: 'style!css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss',
    }]
  },
  postcss: [
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
  ],
  eslint: {
    configFile: '.eslintrc.js',
  },
};
