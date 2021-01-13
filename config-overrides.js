const path = require('path');
module.exports = {
  webpack: (config, env) => {
    if (env === 'development') {
      config.resolve.alias = {
        'react': path.resolve('node_modules/react'),
        'react-dom': path.resolve('node_modules/react-dom'),
        'react-redux': path.resolve('node_modules/react-redux'),
        'redux': path.resolve('node_modules/redux'),
        'redux-saga': path.resolve('node_modules/redux-saga'),
        'redux-form': path.resolve('node_modules/redux-form'),
        '@material-ui': path.resolve('node_modules/@material-ui'),
        '@openchemistry': path.resolve('node_modules/@openchemistry')
      };
    }
    return config;
  },
};
