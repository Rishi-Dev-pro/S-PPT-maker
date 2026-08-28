const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Create a mock for node:fs and other node built-ins
  config.plugins = config.plugins || [];

  // Use NormalModuleReplacementPlugin to replace node: protocol modules with empty mocks
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^node:/,
      (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        switch (mod) {
          case 'fs':
          case 'path':
          case 'crypto':
          case 'os':
          case 'stream':
          case 'buffer':
          case 'util':
          case 'events':
          case 'child_process':
            resource.request = require.resolve('./src/stubs/empty.js');
            break;
          default:
            resource.request = require.resolve('./src/stubs/empty.js');
        }
      }
    )
  );

  // Fallbacks for non-node versions
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
    os: false,
    stream: false,
    buffer: false,
  };

  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    /Failed to parse source map/,
  ];

  return config;
};
