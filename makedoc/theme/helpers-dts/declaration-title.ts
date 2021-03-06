import { DeclarationReflection, ParameterReflection, ReflectionKind } from 'typedoc';
import { ReflectionType } from 'typedoc/dist/lib/models';

import { escape } from './escape';
import { stripComments } from 'typedoc-plugin-markdown/dist/resources/helpers/strip-comments';
import { stripLineBreaks } from 'typedoc-plugin-markdown/dist/resources/helpers/strip-line-breaks';
import { type } from './type';

export function declarationTitle(this: ParameterReflection | DeclarationReflection): string {
  const md: string[] = ['``` ts\n'];
  if (this.flags && this.flags.length > 0 && !this.flags.isRest) {
    md.push(this.flags.map((flag) => `${flag.toLowerCase()}`).join(' '));
  }
  md.push(`${this.flags.isRest ? '... ' : ''} ${escape(this.name)}`);
  if (this instanceof DeclarationReflection && this.typeParameters) {
    md.push(`<${this.typeParameters.map((typeParameter) => typeParameter.name).join(', ')}>`);
  }

  md.push(`: ${this.parent && this.parent.kindOf(ReflectionKind.Enum) ? '' : getType(this)}`);

  if (this.defaultValue && this.defaultValue !== '...') {
    md.push(` = ${stripLineBreaks(escape(stripComments(this.defaultValue)))}`);
  }
  return md.join('') + '\n```';
}

function getType(reflection: ParameterReflection | DeclarationReflection) {
  return type.call(reflection.type ? reflection.type : reflection, shouldCollapse(reflection));
}

function shouldCollapse(reflection: ParameterReflection | DeclarationReflection) {
  if (reflection.kindOf(ReflectionKind.Variable)) {
    const type = reflection.type as ReflectionType;
    if (type.declaration && type.declaration.signatures) {
      return false;
    }
    return true;
  }
  return false;
}
