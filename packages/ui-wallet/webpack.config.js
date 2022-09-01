const { merge } = require('webpack-merge');
const webpack = require('webpack');

/**
 * Get environment variables
 *
 * @param {*} configuration
 * @returns
 */
function getClientEnvironment(configuration) {
  // Grab NODE_ENV and NX_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in webpack configuration.
  const NX_APP = /^NX_/i;

  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || configuration,
      }
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  return {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
}

/**
 * Dependencies used on core layers (eg. Winston, bip39...) needs the
 * [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill),
 * a piece of code to provide modern functionality on older browsers that
 * do not natively support it.
 *
 * Combine default Webpack configuration from Nx with a custom
 * configuration. More here: https://nx.dev/recipe/customize-webpack
 */
module.exports = (config) => {
  console.log(config);
  console.log(getClientEnvironment());

  return merge(config, {
    plugins: [
      new webpack.DefinePlugin(getClientEnvironment()),
      // Work around for when `Buffer` is `undefined`
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      // Load environment variables (eg. `process.env.NODE_ENV`)
      new webpack.ProvidePlugin({
        process: 'process/browser',
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
      alias: {},
    },
  });
};
