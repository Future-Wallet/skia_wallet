module.exports = {
  presets: [
    [
      // Preset used by Nx
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
        },
      },
    ],
  ],
  plugins: [
    // Enable Babel Macros used in package `ui-components`.
    // Learn more https://github.com/kentcdodds/babel-plugin-macros/blob/main/other/docs/user.md
    'babel-plugin-macros',
    [
      // More options
      // https://styled-components.com/docs/tooling#babel-plugin
      // It enhances the attached CSS class name on each component with
      // richer output to help identify the components in the DOM without
      // React DevTools.
      'styled-components',
      { ssr: true, displayName: false },
    ],
  ],
};
