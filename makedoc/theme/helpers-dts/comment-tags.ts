import { DeclarationReflection, ParameterReflection } from 'typedoc';
import { Comment } from 'typedoc/dist/lib/models';
import MarkdownTheme from '../theme';
import { getEntryPath, loadFile } from '../utils';

const config = loadFile(getEntryPath(), 'docs.config');
const label = config.tags || {};
const ignore = config.ignore || [];
const defaultIgnore = ['example', 'since'];

export function commentTags(this: ParameterReflection | DeclarationReflection): string {
  const comment: Comment | undefined = this.comment;
  if (!comment || !comment.tags) return '';
  const md: string[] = [];
  comment.tags.forEach((item, i) => {
    if (defaultIgnore.includes(item.tagName) || ignore.includes(item.tagName)) return;
    const tagName = `${i > 0 ? '\n\n' : ''}<h4>${label[item.tagName] || item.tagName}</h4>\n\n`;
    const text = item.text ? MarkdownTheme.HANDLEBARS.helpers.comment.call(item.text) : '';
    md.push(tagName);
    md.push(text);
  });
  return md.join('');
}
