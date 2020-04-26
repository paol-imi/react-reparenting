// Rollup.
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import strip from '@rollup/plugin-strip';
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
* Released under the MIT license
* https://github.com/Paol-imi/react-reparenting/blob/master/LICENSE
* @license MIT
*/
`;

// Babel options.
const getBabelOptions = ({useESModules}) => ({
  exclude: 'node_modules/**',
  extensions,
  runtimeHelpers: true,
  plugins: [['@babel/transform-runtime', {useESModules}]],
});

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
    external: (id) => !id.startsWith('.') && !id.startsWith('/'),
    plugins: [
      resolve({extensions}),
      replace({'process.env.NODE_ENV': JSON.stringify('development')}),
      babel(getBabelOptions({useESModules: false})),
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
    external: (id) => !id.startsWith('.') && !id.startsWith('/'),
    plugins: [
      resolve({extensions}),
      replace({'process.env.NODE_ENV': JSON.stringify('production')}),
      babel(getBabelOptions({useESModules: false})),
      strip({
        include: extensions.map((ex) => '**/*'.concat(ex)),
        functions: ['warning', 'updateDebugOwner'],
      }),
      terser(),
    ],
  },

  // EcmaScript Module (esm) build
  // - All external packages are not bundled
  {
    input,
    output: {file: pkg.module, format: 'esm', banner},
    external: (id) => !id.startsWith('.') && !id.startsWith('/'),
    plugins: [
      resolve({extensions}),
      replace({'process.env.NODE_ENV': JSON.stringify('production')}),
      babel(getBabelOptions({useESModules: true})),
      strip({
        include: extensions.map((ex) => '**/*'.concat(ex)),
        functions: ['warning', 'updateDebugOwner'],
      }),
    ],
  },
];
