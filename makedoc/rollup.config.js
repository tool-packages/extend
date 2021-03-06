'use strict';

import path from 'path';
import fse from 'fs-extra'; // fs 扩展工具包
import typescript from 'typescript'; // typescript 模块
import ts from 'rollup-plugin-typescript2'; // 编译 typescript
import { eslint } from 'rollup-plugin-eslint'; // eslint 插件

const configure = [];
const ignore = ['rollup.config.js', 'tsconfig.json'];
const resloveEntry = (p) => path.resolve('./makeDoc', p || '');
const resloveOut = (p) => path.resolve('./makedoc', p || '');

const isDirectory = (_dir) => fse.statSync(_dir).isDirectory();

function getFiles(_path) {
  let arr = [];
  const pathJoin = (v) => path.join(_path || '', v);
  const readdirFiles = fse.readdirSync(resloveEntry(_path));
  readdirFiles.forEach((filepath) => {
    if (isDirectory(resloveEntry(pathJoin(filepath)))) {
      arr = arr.concat(getFiles(pathJoin(filepath)));
      return;
    }
    arr.push(pathJoin(filepath));
  });
  return arr;
}

const files = getFiles();

// fse.removeSync(resloveOut());

files.forEach((filepath) => {
  if (filepath.endsWith('.d.ts') || ignore.includes(filepath) || !filepath.endsWith('.ts')) return;
  // if (!filepath.endsWith('.ts')) {
  //   return fse.copySync(resloveEntry(filepath), resloveOut(filepath));
  // }
  // const file_name = filepath.replace(/\.ts$/, '').replace(/-dts/g, '');
  let file_name = filepath.replace(/\.ts$/, '');
  if (/-dts(\/|\\|\\\\|\/\/)/g.test(file_name)) {
    fse.removeSync(file_name.replace(/-dts(\/|\\|\\\\|\/\/).*/g, ''));
    file_name = file_name.replace(/-dts(\/|\\|\\\\|\/\/)/g, '$1');
  }
  configure.push({
    input: resloveEntry(`${filepath}`),
    external: () => true,
    output: {
      sourcemap: false,
      exports: 'named',
      file: resloveOut(`${file_name}.js`),
      format: 'cjs'
    },
    plugins: [
      eslint({
        throwOnError: true,
        throwOnWarning: true,
        exclude: ['node_modules/**', '**/dist/**']
      }),
      ts({
        check: true,
        typescript: typescript, // 随插件安装的 typescript 模块
        tsconfig: path.resolve('./tsconfig.json'), // tsconfig.json的路径。
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: false,
            declaration: false,
            declarationMap: false
          }
        }
      })
    ]
  });
});

export default configure;
