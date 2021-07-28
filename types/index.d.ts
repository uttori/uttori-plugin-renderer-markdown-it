declare module '@uttori/plugin-renderer-markdown-it';

declare module "markdown-it-plugin" {
    export = Plugin;
    function Plugin(md: any, pluginOptions?: object): object;
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
