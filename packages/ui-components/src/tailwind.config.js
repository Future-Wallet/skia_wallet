const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');
// const colors = require('tailwindcss/colors');

const theme = {
  extend: {
    // screens: {
    //   sm: '640px',
    //   md: '768px',
    //   lg: '1024px',
    //   xl: '1280px',
    //   '2xl': '1536px',
    // },
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
    // More on how to use the Material colors here:
    // https://m3.material.io/styles/color/the-color-system/color-roles
    // colors: {
    //   primary: '#',
    //   onPrimary: '#',
    //   primaryContainer: '#',
    //   onPrimaryContainer: '#',
    //   secondary: '#',
    //   onSecondary: '#',
    //   secondaryContainer: '#',
    //   onSecondaryContainer: '#',
    //   tertiary: '#',
    //   onTertiary: '#',
    //   tertiaryContainer: '#',
    //   onTertiaryContainer: '#',
    //   error: '#',
    //   onError: '#',
    //   errorContainer: '#',
    //   onErrorContainer: '#',
    //   background: '#',
    //   onBackground: '#',
    //   surface: '#',
    //   onSurface: '#',
    //   surfaceVariant: '#',
    //   onSurfaceVariant: '#',
    //   outline: '#',
    //   shadow: '#',
    //   inverseSurface: '#',
    //   onInverseSurface: '#',
    //   inversePrimary: '#',
    // },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(__dirname, 'lib/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme,
  plugins: [],
};
