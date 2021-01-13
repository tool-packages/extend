/**
 * 构建软连接
 * @example
 *  node ./script/link.js <target> // 构建软连接
 */

const chalk = require('chalk'); // node 终端样式库
const execa = require('execa'); // 子进程管理工具
const minimist = require('minimist'); // 轻量级的命令行参数解析引擎
const { resolveRoot, resolveTarget, fuzzyMatchTarget, generatePkgName } = require('./utils');

const args = minimist(process.argv.slice(2));
const target = args._.length ? fuzzyMatchTarget(args._)[0] : ''; // 目标项目

if (!target) {
  console.log(chalk.yellow(`请指定需要构建软连接的包`));
  process.exit(1);
}

async function link() {
  await execa('yarn', ['link'], {
    cwd: resolveTarget(target),
    stdio: 'inherit'
  });

  await execa('yarn', ['link', generatePkgName(target)], {
    cwd: resolveRoot(),
    stdio: 'inherit'
  });
}

link();
