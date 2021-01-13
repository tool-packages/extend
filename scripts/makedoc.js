/**
 * 生成文档
 * @example
 *  node ./script/makeDocs.js [targets]
 *  targets // packages 下的软件包，多个使用逗号分隔，默认全部
 *  -s || --select // 选择软件包，将会列出 packages 下所有软件包列表
 *  -a || --all // 匹配所有符合规则的目标，否则只匹配第一次被匹配的的目标
 */

// const path = require('path');
const fse = require('fs-extra'); // fs 扩展工具包
const minimist = require('minimist'); // 轻量级的命令行参数解析引擎
const { prompt } = require('enquirer'); // 创建交互式 cli 提示
const { Application, TSConfigReader, TypeDocReader } = require('typedoc'); // 文档生成工具

const { targets: allTargets, fuzzyMatchTarget, generatePkgName, resolveTarget, pkgDirName, resolveRoot } = require('./utils');

const { FrontMatterComponent } = require(resolveRoot('./makedoc/components/front-matter')); // 文档头部信息

const args = minimist(process.argv.slice(2)); // 命令行参数解析规则

const targets = args._; // 目标项目
const select = args.select || args.s; // 选择软件包
const allMatching = args.all || args.a; // 匹配所有符合规则的目标，否则只匹配第一次被匹配的的目标
const dest = (...args) => resolveRoot('docs', ...args);

fse.removeSync(dest());

run();

/**
 * 运行主程序
 */
async function run() {
  const targetList = await prompts();
  targetList.forEach((target) => {
    makeDocs(target);
  });
}

/**
 * 生成文档 json 对象
 * @param { string } _target 软件包名
 * @returns { Promise<any> } 文档 json 对象
 */
async function makeDocs(_target) {
  const app = new Application();

  app.options.addReader(new TSConfigReader()); // 如果你想载入 tsconfig.json 文件
  app.options.addReader(new TypeDocReader()); // 如果你想载入 typedoc.json 文件

  app.bootstrap({
    /* --- typedoc-theme-markdown --- */
    // @ts-ignore
    hideBreadcrumbs: true, // 不要在模板标题中呈现面包屑
    hideInPageTOC: true, // 不要呈现页内目录项
    allReflectionsHaveOwnDocument: false, // 将所有反射输出到单独的输出文件中
    /* --- typedoc --- */
    entryPoints: [resolveTarget(_target, './src/index.ts')],
    tsconfig: resolveRoot('./tsconfig.json'),
    name: generatePkgName(_target), // 设置将在模板标题中使用的项目的名称
    includes: resolveTarget(_target), // 包含文件
    exclude: ['**/*.test.ts', '**/*/__test__', '**/*/dist', '**/*/index.ts'], // 排除的文件
    disableOutputCheck: false, // 禁用检查和清除指定的输出目录
    categorizeByGroup: false, // 进行分类，默认为 true
    hideGenerator: true, // 隐藏页底的全局链接
    disableSources: false, // 禁用当前代码所定义的路径
    media: '', // 包含媒体
    excludeTags: [], // 忽略的标签
    readme: '', // 应在索引页面上显示的自述文件的路径, 通过 none 以禁用索引页面并在 globals 页面上启动文档
    // theme: 'markdown',
    theme: resolveRoot('./makedoc/theme'), // 指定应使用的主题的路径
    plugin: ['typedoc-plugin-markdown'],
    excludeExternals: true, // 是否排除外部引入的模块
    excludePrivate: true, // 是否排除 private 修饰的相关字段方法
    excludeProtected: true // 是否排除 protected 修饰的相关字段方法
    // externalPattern: [] // 外部的文件
  });

  app.renderer.addComponent('frontmatter', new FrontMatterComponent(app.renderer));

  const project = app.convert();

  if (!project) process.exit(1);

  await app.generateDocs(project, dest(_target));
  await app.generateJson(project, resolveRoot(`docs/${_target}.json`));
}

/**
 * 用户交互部分
 * @returns { Promise<string[]> } 交互所产生的值
 */
async function prompts() {
  const targetList = allTargets.map(generatePkgName); // 可用包列表
  let _targets = targetList; // 默认所有可用包
  if (select) {
    // 选择软件包
    // @ts-ignore
    const { list } = await prompt({
      type: 'multiselect', // 提示的类型
      name: 'list', // 返回值对象上的键
      message: '请选择需要生成文档的软件包', // 在终端中呈现提示时显示的消息
      choices: targetList // 选项数组
    });
    _targets = list;
  } else if (targets.length >= 1) {
    // 如果有输入的包
    _targets = fuzzyMatchTarget(targets, allMatching).map((v) => generatePkgName(v));
  }
  return _targets.map((v) => pkgDirName(v));
}
