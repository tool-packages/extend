const path = require('path');
const fse = require('fs-extra'); // fs 扩展工具包
const execa = require('execa'); // 子进程管理工具

if (
  !fse.existsSync(path.resolve(__dirname, './components')) ||
  !fse.existsSync(path.resolve(__dirname, './theme/helpers')) ||
  !fse.existsSync(path.resolve(__dirname, './theme/theme.js')) ||
  !fse.existsSync(path.resolve(__dirname, './theme/utils.js'))
) {
  compileDocs();
}

async function compileDocs() {
  await execa('yarn', ['docs:compile'], {
    stdio: 'inherit'
  });
}
