import * as path from 'path';
import { Renderer } from 'typedoc';
import { FrontMatterComponent as DefaultFrontMatterComponent } from 'typedoc-plugin-markdown/dist/components/front-matter';
import { Component } from 'typedoc/dist/lib/output/components';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { reflectionTitle } from 'typedoc-plugin-markdown/dist/resources/helpers/reflection-title';

@Component({ name: 'front-matter' })
export class FrontMatterComponent extends DefaultFrontMatterComponent {
  _filesArr: string[] = [];
  constructor(renderer: Renderer) {
    super(renderer);
  }

  onPageEnd(page: PageEvent): void {
    const templateName = page.templateName || '';
    if (this._filesArr.includes(templateName)) return;
    this._filesArr.push(templateName);
    if (page.contents) {
      page.contents = page.contents
        .replace(/^/, `${this.getYamlString(this.getYamlItems(page))}\n\n`)
        .replace(/[\r\n]{3,}/g, '\n\n');
    }
  }

  getYamlString(yamlItems: { [key: string]: string | number | boolean }): string {
    const yaml = `---
${Object.entries(yamlItems)
  .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${this.escapeYAMLString(value)}"` : value}`)
  .join('\n')}
---`;
    return yaml;
  }

  getDefaultValues(page: PageEvent): any {
    return {
      id: this.getId(page),
      title: this.getTitle(page)
    };
  }

  getId(page: PageEvent): string {
    return path.basename(page.url, path.extname(page.url));
  }

  getTitle(page: PageEvent): string {
    if (page.url === 'modules.md') {
      return 'API';
    } else if (page.url === 'README.md') {
      return '快速上手';
    }
    return reflectionTitle.call(page, false);
  }
}
