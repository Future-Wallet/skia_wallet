import { resolve } from 'path';

// Layout components
export * from './lib/layout/box';
export * from './lib/layout/center';
export * from './lib/layout/cluster';
export * from './lib/layout/grid';
export * from './lib/layout/stack';

// Common components
export * from './lib/atomic_components/button/button';
export * from './lib/components/navigation_bars/navigation_bar';

// TailwindCSS
export const withTailwindUiComponents = resolve(
  __dirname,
  '../tailwind.config.js'
);
// export const withTailwindUiComponents = import('../tailwind.config.js');

// Miscelleanous
export * from './lib/types';
