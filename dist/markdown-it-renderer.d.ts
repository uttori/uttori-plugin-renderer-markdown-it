export default MarkdownItRenderer;
export type MarkdownItRendererOptionsUttori = {
    /**
     * Prefix for relative URLs, useful when the Express app is not at URI root.
     */
    baseUrl: string;
    /**
     * Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org).
     */
    allowedExternalDomains: string[];
    /**
     * Open external domains in a new window.
     */
    openNewWindow: boolean;
    /**
     * Add lazy loading params to image tags.
     */
    lazyImages: boolean;
    /**
     * Footnote settings.
     */
    footnotes: {
        referenceTag: Function;
        definitionOpenTag: Function;
        definitionCloseTag: string;
    };
    /**
     * Table of Contents settings.
     */
    toc: {
        extract: boolean;
        openingTag: string;
        closingTag: string;
        slugify: object;
    };
    /**
     * WikiLinks settings.
     */
    wikilinks: {
        slugify: object;
    };
};
/**
 * @typedef {object} MarkdownItRendererOptionsUttori
 * @property {string} baseUrl Prefix for relative URLs, useful when the Express app is not at URI root.
 * @property {string[]} allowedExternalDomains Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org).
 * @property {boolean} openNewWindow Open external domains in a new window.
 * @property {boolean} lazyImages Add lazy loading params to image tags.
 * @property {object} footnotes Footnote settings.
 * @property {Function} footnotes.referenceTag A funciton to return the default HTML for a footnote reference.
 * @property {Function} footnotes.definitionOpenTag A funciton to return the default opening HTML for a footnote definition.
 * @property {string} footnotes.definitionCloseTag The default closing HTML for a footnote definition.
 * @property {object} toc Table of Contents settings.
 * @property {boolean} toc.extract When true, extract the table of contents to the view model from the content.
 * @property {string} toc.openingTag The opening DOM tag for the TOC container.
 * @property {string} toc.closingTag The closing DOM tag for the TOC container.
 * @property {object} toc.slugify Slugify options for convering headings to anchor links.
 * @property {object} wikilinks WikiLinks settings.
 * @property {object} wikilinks.slugify Slugify options for convering Wikilinks to anchor links.
 */
/**
 * Uttori MarkdownIt Renderer
 * @example <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 * @class
 */
declare class MarkdownItRenderer {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @type {string}
     * @returns {string} The configuration key.
     * @example <caption>MarkdownItRenderer.configKey</caption>
     * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
     * @static
     */
    static get configKey(): string;
    /**
     * The default configuration.
     * @returns {MarkdownIt.Options} The default configuration.
     * @example <caption>MarkdownItRenderer.defaultConfig()</caption>
     * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
     * @static
     */
    static defaultConfig(): MarkdownIt.Options;
    /**
     * Create a config that is extended from the default config.
     * @param {MarkdownIt.Options} config The user provided configuration.
     * @returns {MarkdownIt.Options} The new configration.
     */
    static extendConfig(config?: MarkdownIt.Options): MarkdownIt.Options;
    /**
     * Validates the provided configuration for required entries.
     * @param {Record<string, MarkdownIt.Options>} config A provided configuration to use.
     * @param {object} _context Unused
     * @example <caption>MarkdownItRenderer.validateConfig(config, _context)</caption>
     * MarkdownItRenderer.validateConfig({ ... });
     * @static
     */
    static validateConfig(config: Record<string, MarkdownIt.Options>, _context: object): void;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @param {object} context A Uttori-like context.
     * @param {object} context.hooks An event system / hook system to use.
     * @param {Function} context.hooks.on An event registration function.
     * @param {MarkdownIt.Options} context.config A provided configuration to use.
     * @example <caption>MarkdownItRenderer.register(context)</caption>
     * const context = {
     *   hooks: {
     *     on: (event, callback) => { ... },
     *   },
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *       events: {
     *         renderContent: ['render-content', 'render-meta-description'],
     *         renderCollection: ['render-search-results'],
     *         validateConfig: ['validate-config'],
     *       },
     *     },
     *   },
     * };
     * MarkdownItRenderer.register(context);
     * @static
     */
    static register(context: {
        hooks: {
            on: Function;
        };
        config: MarkdownIt.Options;
    }): void;
    /**
     * Renders Markdown for a provided string with a provided context.
     * @param {string} content Markdown content to be converted to HTML.
     * @param {object} context A Uttori-like context.
     * @param {MarkdownIt.Options} context.config A provided configuration to use.
     * @returns {string} The rendered content.
     * @example <caption>MarkdownItRenderer.renderContent(content, context)</caption>
     * const context = {
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *     },
     *   },
     * };
     * MarkdownItRenderer.renderContent(content, context);
     * @static
     */
    static renderContent(content: string, context: {
        config: MarkdownIt.Options;
    }): string;
    /**
     * Renders Markdown for a collection of Uttori documents with a provided context.
     * @param {object[]} collection A collection of Uttori documents.
     * @param {object} context A Uttori-like context.
     * @param {MarkdownIt.Options} context.config A provided MarkdownIt configuration to use.
     * @returns {object[]}} The rendered documents.
     * @example <caption>MarkdownItRenderer.renderCollection(collection, context)</caption>
     * const context = {
     *   config: {
     *     [MarkdownItRenderer.configKey]: {
     *       ...,
     *     },
     *   },
     * };
     * MarkdownItRenderer.renderCollection(collection, context);
     * @static
     */
    static renderCollection(collection: object[], context: {
        config: MarkdownIt.Options;
    }): object[];
    /**
     * Renders Markdown for a provided string with a provided MarkdownIt configuration.
     * @param {string} content Markdown content to be converted to HTML.
     * @param {MarkdownIt.Options} config A provided MarkdownIt configuration to use.
     * @returns {string} The rendered content.
     * @example <caption>MarkdownItRenderer.render(content, config)</caption>
     * const html = MarkdownItRenderer.render(content, config);
     * @static
     */
    static render(content: string, config: MarkdownIt.Options): string;
    /**
     * Parse Markdown for a provided string with a provided MarkdownIt configuration.
     * @param {string} content Markdown content to be converted to HTML.
     * @param {MarkdownIt.Options} config A provided MarkdownIt configuration to use.
     * @returns {import('markdown-it/lib/token')[]} The rendered content.
     * @example <caption>MarkdownItRenderer.parse(content, config)</caption>
     * const tokens = MarkdownItRenderer.parse(content, config);
     * @see {@link https://markdown-it.github.io/markdown-it/#MarkdownIt.parse|MarkdownIt.parse}
     * @static
     */
    static parse(content: string, config: MarkdownIt.Options): any[];
    /**
     * Removes empty links, as these have caused issues.
     * Find missing links, and link them to the slug from the provided text.
     * @param {string} content Markdown content to be converted to HTML.
     * @returns {string} The rendered content.
     * @static
     */
    static cleanContent(content: string): string;
    /**
     * Will attempt to extract the table of contents when set to and add it to the view model.
     * @param {object} viewModel Markdown content to be converted to HTML.
     * @param {object} context A Uttori-like context.
     * @param {MarkdownIt.Options} context.config A provided configuration to use.
     * @returns {object} The view model.
     * @example <caption>MarkdownItRenderer.viewModelDetail(viewModel, context)</caption>
     * viewModel = MarkdownItRenderer.viewModelDetail(viewModel, context);
     * @static
     */
    static viewModelDetail(viewModel: object, context: {
        config: MarkdownIt.Options;
    }): object;
}
import MarkdownIt from 'markdown-it';
//# sourceMappingURL=markdown-it-renderer.d.ts.map