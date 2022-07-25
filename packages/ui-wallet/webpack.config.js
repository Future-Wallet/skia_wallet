const { merge } = require('webpack-merge');

/**
 * Combine default Webpack configuration from Nx with a custom configuration.
 *
 * More here: https://nx.dev/guides/customize-webpack
 */
module.exports = (config, context) => {
  return merge(config, {
    // polyfills: require('./src/polyfills'),
    // resolve: { fallback: { stream: false } },
    resolve: { fallback: { stream: require.resolve('stream-browserify') } },
    // This is the default Webpack config on file `project.json`: "webpackConfig": "@nrwl/react/plugins/webpack"
  });
};
