declare module '@uttori/plugin-renderer-markdown-it';

declare module "footnotes" {
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
}
declare module "toc" {
    export function headingOpen(tokens: Token[], index: number, options: object): string;
    export function tocOpen(_tokens: Token[], _index: number, options: object): string;
    export function tocClose(_tokens: Token[], _index: number, options: object): string;
    export function tocBody(_tokens: Token[], _index: number, options: object, env: object, _slf: Renderer): string;
    export function tocRule(state: StateInline): boolean;
    export function collectHeaders(state: StateCore): void;
}
declare module "wikilinks" {
    export function wikilinks(state: StateInline): boolean;
}
declare module "youtube" {
    export function youtube(state: StateCore): void;
}
declare module "uttori-inline" {
    export function getValue(token: Token, key: string): any | undefined;
    export function updateValue(token: Token, key: string, value: string): void;
    export function uttoriInline(state: StateCore): boolean;
}
declare module "markdown-it-plugin" {
    export = Plugin;
    function Plugin(md: MarkdownIt): object;
}
declare module "index" {
    export = MarkdownItRenderer;
    class MarkdownItRenderer {
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
    }
    namespace MarkdownItRenderer {
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
                openingTag?: string;
                closingTag?: string;
                slugify?: object;
            };
            wikilinks?: {
                slugify?: object;
            };
        };
    };
}
