const withNx = require('@nrwl/next/plugins/with-nx');
const intercept = require('intercept-stdout');

// =========================
// Solve a Recoil issue https://github.com/facebookexperimental/Recoil/issues/733

// Safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return '';
  }
  return text;
}

if (process.env.NODE_ENV === 'development') {
  intercept(interceptStdout);
}
// =========================

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: true, // For highlighting potential problems in an application
  poweredByHeader: false,
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // Support Eslint errors
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withNx(nextConfig);
