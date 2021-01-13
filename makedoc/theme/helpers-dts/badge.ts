import { DeclarationReflection } from 'typedoc';
import { Comment } from 'typedoc/dist/lib/models';
import MarkdownTheme from '../theme';
import { getEntryPath, loadFile } from '../utils';

const config = loadFile(getEntryPath(), 'docs.config');
const ignore = config.ignore || [];

export function badge(this: DeclarationReflection): string {
  const comment: Comment | undefined = this.comment
    ? this.comment
    : this.signatures && this.signatures[0]
    ? this.signatures[0].comment
    : undefined;
  if (!comment || !comment.tags || ignore.includes('since')) return '';
  const since = comment.tags.find((v) => v.tagName === 'since');
  const text = since && since.text ? MarkdownTheme.HANDLEBARS.helpers.comment.call(since.text) : '';
  return ` <Badge text="${text}"/>`;
}

exports.badge = badge;
