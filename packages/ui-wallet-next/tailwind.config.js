const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

// TODO: Nx doesn't recognize monorepo's packages. Probably
// it needs a reconfiguration in some part.
// const { withTailwindUiComponents } = require('@skiawallet/ui-components');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // presets: [withTailwindUiComponents],
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [require('@tailwindcss/forms')],
};
