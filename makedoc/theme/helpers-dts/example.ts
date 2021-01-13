import { DeclarationReflection, ParameterReflection } from 'typedoc';
import { Comment } from 'typedoc/dist/lib/models';
import MarkdownTheme from '../theme';
import { getEntryPath, loadFile } from '../utils';

const config = loadFile(getEntryPath(), 'docs.config');
const label = config.tags || {};
const ignore = config.ignore || [];

export function example(this: ParameterReflection | DeclarationReflection): string {
  const comment: Comment | undefined = this.comment;
  if (!comment || !comment.tags || ignore.includes('example')) return '';
  const item = comment.tags.find((v) => v.tagName === 'example');
  if (!item) return '';
  const tagName = `<h4>${label[item.tagName] || item.tagName}</h4>\n\n`;
  const text = item.text ? MarkdownTheme.HANDLEBARS.helpers.comment.call(item.text) : '';
  return `${tagName}${text}`;
}
