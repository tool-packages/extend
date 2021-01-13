import { ReflectionType, Type, Comment } from 'typedoc/dist/lib/models';
import { DeclarationReflection } from 'typedoc';
import { propertyTable } from './property-table';
import { type } from './type';
import MarkdownTheme from '../theme';

// export function returns(this: ReflectionType): string {
//   const md = [`**Returns:** ${type.call(this, true)}`];
//   if (this instanceof ReflectionType && this.declaration && this.declaration.children) {
//     md.push(propertyTable.call(this.declaration.children as DeclarationReflection[]));
//   }
//   return md.join('\n\n');
// }

export function returns(this: DeclarationReflection): string {
  const md: string[] = [];
  const oType: Type | undefined = this.type;
  const comment: Comment | undefined = this.comment;
  const text: string = comment && comment.returns ? comment.returns : '';
  const typeStr: string = type.call(oType as Type, true);
  md.push(`${typeStr ? `\`(${typeStr})\`: ` : ''}${MarkdownTheme.HANDLEBARS.helpers.comment.call(text)}`);
  if (oType && oType instanceof ReflectionType && oType.declaration && oType.declaration.children) {
    md.push(propertyTable.call(oType.declaration.children as DeclarationReflection[]));
  }
  return md.join('\n\n');
}
