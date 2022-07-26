const { merge } = require('webpack-merge');
const webpack = require('webpack');

/**
 * Combine default Webpack configuration from Nx with a custom configuration.
 *
 * More here: https://nx.dev/guides/customize-webpack
 */
module.exports = (config, context) => {
  return merge(config, {
    plugins: [
      // Work around for when `Buffer` is `undefined`
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      },
    },
  });
};
