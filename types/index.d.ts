/* eslint-disable no-redeclare */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-use-before-define */
import MarkdownIt from 'markdown-it/lib';
import Renderer from 'markdown-it/lib/renderer';
import StateCore from 'markdown-it/lib/rules_core/state_core';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import StateInline from 'markdown-it/lib/rules_inline/state_inline';
import Token from 'markdown-it/lib/token';

declare module '@uttori/plugin-renderer-markdown-it';

export function footnoteDefinition(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
export function footnoteReferences(state: StateInline, silent: boolean): boolean;
export function referenceTag({ id, label }: {
  id: number;
  label: string;
}): string;
export function definitionOpenTag({ id, label }: {
  id: number;
  label: string;
}): string;
export function configFootnoteReference(tokens: Token[], index: number, options: object, _env: object, _slf: Renderer): string;
export function configFootnoteOpen(tokens: Token[], index: number, options: object, _env: object, _slf: Renderer): string;
export function configFootnoteClose(_tokens: Token[], _index: number, options: object, _env: object, _slf: Renderer): string;

export function headingOpen(tokens: Token[], index: number, options: object): string;
export function tocOpen(_tokens: Token[], _index: number, options: object): string;
export function tocClose(_tokens: Token[], _index: number, options: object): string;
export function tocBody(_tokens: Token[], _index: number, options: object, env: object, _slf: Renderer): string;
export function tocRule(state: StateInline): boolean;
export function collectHeaders(state: StateCore): void;

export function wikilinks(state: StateInline): boolean;

export function youtube(state: StateCore): void;

export function getValue(token: Token, key: string): any | undefined;
export function updateValue(token: Token, key: string, value: string): void;
export function uttoriInline(state: StateCore): boolean;
export function lineBreaker(state: StateCore): void;

export function Plugin(md: MarkdownIt): object;

export class MarkdownItRenderer {
  static get configKey(): string;
  static defaultConfig(): MarkdownItRendererOptions;
  static extendConfig(config?: MarkdownItRendererOptions): MarkdownItRendererOptions;
  static validateConfig(config: {
      configKey: MarkdownItRendererOptions;
  }, _context: object): void;
  static register(context: {
      hooks: {
          on: Function;
      };
      config: {
          events: object;
      };
  }): void;
  static renderContent(content: string, context: {
      config: object;
  }): string;
  static renderCollection(collection: object[], context: {
      config: object;
  }): object[];
  static render(content: string, config: object): string;
  static viewModelDetail(viewModel: object, context: {
    config: {
      uttori: {
        toc: {
          extract: boolean;
        };
      };
    };
  }): object;
}
export namespace MarkdownItRenderer {
  export { MarkdownItRendererOptions };
}
type MarkdownItRendererOptions = {
  html?: boolean;
  xhtmlOut?: boolean;
  breaks?: boolean;
  langPrefix?: string;
  linkify?: boolean;
  typographer?: boolean;
  quotes?: string;
  highlight?: Function;
  events?: object;
  uttori?: {
    baseUrl?: string;
    allowedExternalDomains?: string[];
    openNewWindow?: boolean;
    lazyImages?: boolean;
    footnotes?: {
      referenceTag?: Function;
      definitionOpenTag?: Function;
      definitionCloseTag?: string;
    };
    toc?: {
      extract?: boolean;
      openingTag?: string;
      closingTag?: string;
      slugify?: object;
    };
    wikilinks?: {
      slugify?: object;
    };
  };
};
