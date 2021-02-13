// Rollup.
import {babel} from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

// Package.json
import pkg from './package.json';

// Common.
const input = './src/index.ts';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const banner = `/**
* React-reparenting v${pkg.version}
* ${pkg.homepage}
* Copyright (c) 2020-present, Paol-imi
* https://github.com/Paol-imi/react-reparenting/blob/master/LICENSE
* @license MIT
*/
`;

// Babel options.
const getBabelOptions = () => ({
  exclude: 'node_modules/**',
  extensions,
  babelHelpers: 'runtime',
});

const external = (id) => !id.startsWith('.');

export default [
  // CommonJS (cjs) development build
  // - All external packages are not bundled
  {
    input,
    output: {
      file: 'dist/react-reparenting.cjs.development.js',
      format: 'cjs',
      banner,
    },
    external,
    plugins: [
      resolve({extensions}),
      replace({__DEV__: JSON.stringify(true)}),
      babel(getBabelOptions()),
    ],
  },

  // CommonJS (cjs) production build
  // - All external packages are not bundled
  {
    input,
    output: {
      file: 'dist/react-reparenting.cjs.production.min.js',
      format: 'cjs',
      banner,
    },
    external,
    plugins: [
      resolve({extensions}),
      replace({__DEV__: JSON.stringify(false)}),
      babel(getBabelOptions()),
      terser(),
    ],
  },

  // EcmaScript Module (esm) build
  // - All external packages are not bundled
  {
    input,
    output: {
      file: pkg.module,
      format: 'es',
      banner,
    },
    external,
    plugins: [
      resolve({extensions}),
      replace({__DEV__: JSON.stringify(false)}),
      babel(getBabelOptions()),
    ],
  },
];
