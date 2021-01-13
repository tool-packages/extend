import { DeclarationReflection } from 'typedoc';
import { ReflectionKind, Type } from 'typedoc/dist/lib/models';

import { comment } from './comment';
import { escape } from './escape';
import { stripLineBreaks } from 'typedoc-plugin-markdown/dist/resources/helpers/strip-line-breaks';
import { type } from './type';

export function propertyTable(this: DeclarationReflection[], kind?: ReflectionKind): string {
  const commentsMap = this.map(
    (param) => (param.comment && !!param.comment.text) || (param.comment && !!param.comment.shortText)
  );
  const hasComments = !commentsMap.every((value) => !value);
  const hasValues = kind === ReflectionKind.Variable;
  const headers = ['名称', '类型'];
  if (hasValues) {
    headers.push('值');
  }
  if (hasComments) {
    headers.push('描述');
  }

  const rows = this.map((property) => {
    const propertyType = property.signatures || property.children ? property : property.type;
    const row: string[] = [];
    const nameCol: string[] = [];
    const name = property.name.match(/[\\`\\|]/g) !== null ? escape(getName(property)) : `\`${getName(property)}\``;
    nameCol.push(name);
    row.push(nameCol.join(' '));
    row.push(type.call(propertyType as Type, kind === ReflectionKind.Variable));
    if (hasValues) {
      row.push(
        property.defaultValue && property.defaultValue !== '...'
          ? escape(stripLineBreaks(property.defaultValue))
          : stripLineBreaks(type.call(propertyType as Type))
      );
    }

    if (hasComments) {
      if (property.comment) {
        row.push(stripLineBreaks(comment.call(property.comment)));
      } else {
        row.push('-');
      }
    }
    return `${row.join(' | ')} |\n`;
  });

  const output = `\n${headers.join(' | ')} |\n${headers.map(() => '------').join(' | ')} |\n${rows.join('')}`;

  return output;
}

function getName(property: DeclarationReflection) {
  const md: string[] = [];
  if (property.flags.isRest) {
    md.push('...');
  }
  md.push(property.name);
  if (property.flags.isOptional) {
    md.push('?');
  }
  return md.join('');
}
