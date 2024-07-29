const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills here
  config.node = {
    process: true,
  };
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);

  return config;
}
