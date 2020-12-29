const path = require('path');
module.exports = {
  webpack: (config, env) => {
    if (env === 'development') {
      config.resolve.alias = {
        react: path.resolve('node_modules/react'),
        'react-redux': path.resolve('node_modules/react-redux'),
        '@openchemistry': path.resolve('node_modules/@openchemistry')
      };
    }
    return config;
  },
};
