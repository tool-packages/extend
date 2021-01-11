import MarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import { DeclarationReflection, ProjectReflection, Reflection, Renderer, UrlMapping } from 'typedoc';

export default class VuePressTheme extends MarkdownTheme {
  constructor(renderer: Renderer, basePath: string) {
    super(renderer, basePath);
  }

  getUrls(project: ProjectReflection): UrlMapping[] {
    const urls: UrlMapping[] = [];
    if (this.readme === 'none') {
      project.url = this.entryDocument;
      urls.push(new UrlMapping(this.entryDocument, project, 'reflection.hbs'));
    } else {
      project.url = this.globalsFile;
      urls.push(new UrlMapping(this.globalsFile, project, 'reflection.hbs'));
      urls.push(new UrlMapping(this.entryDocument, project, 'index.hbs'));
    }
    project.children?.forEach((child: Reflection) => {
      if (child instanceof DeclarationReflection) {
        this.buildUrls(child as DeclarationReflection, urls);
      }
    });
    return urls;
  }

  buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[] {
    const mapping = this.mappings.find((mapping) => reflection.kindOf(mapping.kind));
    if (mapping) {
      if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
        const url = this.toUrl(mapping, reflection);
        urls.push(new UrlMapping(url, reflection, mapping.template));
        reflection.url = url;
        reflection.hasOwnDocument = true;
      }
      for (const child of reflection.children || []) {
        if (mapping.isLeaf) {
          this.applyAnchorUrl(child, reflection);
        } else {
          this.buildUrls(child, urls);
        }
      }
    } else if (reflection.parent) {
      this.applyAnchorUrl(reflection, reflection.parent);
    }
    return urls;
  }

  get globalsFile(): string {
    return 'modules.md';
  }

  get navigationEnabled(): boolean {
    return false;
  }
}
