const fse = require('fs-extra'); // fs 扩展工具包
const { resolveRoot } = require('./utils');
const execa = require('execa'); // 子进程管理工具

if (!fse.existsSync(resolveRoot('./temp/makedoc'))) {
  compileDocs();
}

async function compileDocs() {
  await execa('yarn', ['docs:compile'], {
    stdio: 'inherit'
  });
}
