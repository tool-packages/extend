const path = require('path');
const fse = require('fs-extra'); // fs 扩展工具包
const chalk = require('chalk'); // node终端样式库
const rootDir = path.resolve(__dirname, '../'); // 根路径地址
const targetsDir = path.resolve(__dirname, '../packages'); // 存放包的文件夹

/**
 * 解析根路径下绝对路径
 * @param { string[] } args 路径
 * @returns { string } 绝对路径
 */
const resolveRoot = (...args) => path.resolve(rootDir, ...args);

/**
 * 获取到指定包文件夹绝对路径
 * @param { string[] } args 包文件夹名称及路径
 * @returns { string } 绝对路径
 */
const resolveTarget = (...args) => path.resolve(targetsDir, ...args);

/**
 * 检测是否为文件夹
 * @param { string } _dir 路径
 * @returns { boolean } true | false
 */
const isDirectory = (_dir) => fse.statSync(_dir).isDirectory();

/**
 * 驼峰命名
 * @param { string } str - 需要格式化的字符串
 * @returns { string } 返回格式化之后的字符串
 */
const camelCase = (str) => {
  return str
    .replace(/([\\:\-\\_]+(.))/g, (_, separator, letter, offset) => (offset ? letter.toUpperCase() : letter))
    .replace(/^moz([A-Z])/, 'Moz$1');
};

/**
 * 可用的包列表
 * @constant { string[] } targets 可用的包列表
 * @desp 过滤掉非文件夹、私有包并且没有 buildOptions 参数的包、没有 package.json 文件的包
 */
const targets = fse.readdirSync(targetsDir).filter((target) => {
  if (!isDirectory(resolveTarget(target))) return false;
  try {
    const pkg = require(resolveTarget(target, './package.json'));
    return !(pkg.private && !pkg.buildOptions);
  } catch (error) {}
  return false;
});

/**
 * 模糊匹配目标
 * @param { string[] | RegExp[] } partialTargets // 匹配的目标或规则
 * @param { boolean } includeAllMatching 匹配所有符合规则的目标，否则只匹配第一次被匹配的的目标
 * @returns { string[] } 匹配的列表
 * @example
 *  const targets = ['a', 'ab', 'abc', 'b', 'bd', 'bc', 'ca', 'cd', 'c']
 *  fuzzyMatchTarget(['a'], true) // => ['a', 'ab', 'abc', 'ca']
 *  fuzzyMatchTarget(['a']) // => ['a']
 *  fuzzyMatchTarget([/^a/], true) // => ['a', 'ab', 'abc']
 *  fuzzyMatchTarget([/^a/]) // => ['a']
 *  fuzzyMatchTarget([/^a/, /^b/], true) // => ['a', 'ab', 'abc', 'b', 'bd', 'bc']
 *  fuzzyMatchTarget([/^a/, /^b/]) // => ['a', 'b']
 *  fuzzyMatchTarget(['b', 'c']) // => ['ab', 'abc']
 */
const fuzzyMatchTarget = (partialTargets, includeAllMatching = false) => {
  const matched = []; // 匹配列表
  partialTargets.forEach((partialTarget) => {
    for (const target of targets) {
      // 如果与目标匹配，存入匹配列表
      if (target.match(partialTarget)) {
        matched.push(target);
        // 如果只匹配第一次，跳出
        if (!includeAllMatching) break;
      }
    }
  });
  if (matched.length) {
    return matched;
  } else {
    console.log();
    console.error(`${chalk.bgRed.white(' 错误 ')} ${chalk.red(`目标 ${chalk.underline(partialTargets)} 不存在!`)}`);
    console.log();
    process.exit(1);
  }
};

/**
 * 格式化包名(去除 '@roshin/')
 * @param { string } _name 包名
 * @returns { string } 格式化后的包名
 */
const formatPkgName = (_name) => _name.replace(/(.*\/)/, '');

/**
 * 包文件夹名(去除 '@roshin/extend-')
 * @param { string } _name 包名
 * @returns { string } 格式化后的包名
 */
const pkgDirName = (_name) => {
  const mainPkg = require(resolveRoot('package.json'));
  return _name.replace(new RegExp(`^${mainPkg.name}-`), '');
};

/**
 * 生成包名
 * @param { string } _target 包文件名
 * @returns { string } 包名
 */
const generatePkgName = (_target) => {
  const pkg = require(resolveRoot('./package.json'));
  const pkg_name = formatPkgName(pkg.name);
  return _target === pkg_name ? pkg.name : `${pkg.name}-${_target}`;
};

exports.targets = targets;
exports.resolveRoot = resolveRoot;
exports.resolveTarget = resolveTarget;
exports.isDirectory = isDirectory;
exports.camelCase = camelCase;
exports.fuzzyMatchTarget = fuzzyMatchTarget;
exports.pkgDirName = pkgDirName;
exports.formatPkgName = formatPkgName;
exports.generatePkgName = generatePkgName;
