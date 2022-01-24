import { JSDOM } from 'jsdom';

export class HtmlMock {
  static parse(html: string): HTMLElement {
    const element = JSDOM.fragment(`<div>${html}</div>`);

    // @ts-ignore
    return element.children[0];
  }

  static parseWithWrapper(html: string): HTMLElement {
    return HtmlMock.parse(`<div>${html}</div>`);
  }

  static empty(): HTMLElement {
    return HtmlMock.parseWithWrapper('');
  }

  static parseText(html: string): string {
    return HtmlMock.parseWithWrapper(html).textContent || '';
  }
}
