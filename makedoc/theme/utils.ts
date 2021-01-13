import * as path from 'path';
import * as fs from 'fs';

/**
 * 获取项目根路径
 * @param { string } startPath 开始路径，默认当前路径
 * @returns { string } 返回当前 package.json 文件所在路径
 */
export const getEntryPath = (startPath?: string): string => {
  let mainFileName = startPath || '';
  // 如果没有传入地址，拿到当前执行文件路径或文件所在根路径
  if (!startPath) {
    mainFileName = require.main ? require.main.filename : __dirname;
    if (mainFileName.indexOf('node_modules') > 0) return mainFileName.split('node_modules')[0];
  }
  let currentPath = path.join(mainFileName);
  let result = '';
  // 这里定义一个循环，朝招当前目录下的 package.json 文件，如果存在，则以此文件夹为标准，否则继续向上查找，直到磁盘根目录
  while (!/(:\/$)|(:\\$)|(^\\$)|(^\/$)/.test(currentPath)) {
    if (fs.existsSync(currentPath + '/package.json')) {
      result = currentPath;
      break;
    }
    currentPath = path.resolve(currentPath, '../');
  }
  return result || currentPath;
};

/**
 * 加载文件，并忽略其错误
 * @param { string } entryPath 文件路径
 * @param { string } file 文件名称
 * @returns { any } 返回 object
 */
export const loadFile = (entryPath: string, file: string): any => {
  try {
    return require(path.resolve(entryPath, file));
  } catch (ex) {}
  return {};
};
