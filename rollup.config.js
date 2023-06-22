import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

const input = './src/index.ts';
const banner = `/**
* ${pkg.name} v${pkg.version}
* ${pkg.homepage}
* Copyright (c) 2022-present, ${pkg.author.name}
* https://github.com/paol-imi/${pkg.name}/blob/main/LICENSE
* @license MIT
*/
`;
const plugins = [
  replace({ __DEV__: "process.env.NODE_ENV === 'production'" }),
  esbuild(),
];

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'es',
      banner,
    },
    plugins,
  },
];
