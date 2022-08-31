const { merge } = require('webpack-merge');
const webpack = require('webpack');

/**
 * Dependencies used on core layers (eg. Winston, bip39...) needs the
 * [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill),
 * a piece of code to provide modern functionality on older browsers that
 * do not natively support it.
 *
 * Combine default Webpack configuration from Nx with a custom
 * configuration. More here: https://nx.dev/recipe/customize-webpack
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
        // Used by bip39
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),

        // Used by dependency Winston
        os: false,
        util: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        // os: require.resolve('os-browserify/browser'),
        // util: require.resolve('util/'),
        // path: require.resolve('path-browserify'),
        // zlib: require.resolve('browserify-zlib'),
        // http: require.resolve('stream-http'),
        // https: require.resolve('https-browserify'),
        // assert: require.resolve('assert/'),
        fs: false,
      },
    },
  });
};
