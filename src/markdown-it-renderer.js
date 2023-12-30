import MarkdownIt from 'markdown-it';
import slugify from 'slugify';
import markdownItPlugin from './markdown-it-plugin.js';
import { referenceTag, definitionOpenTag } from './footnotes.js';

let debug = (..._) => {};
/* c8 ignore next 2 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
try { const { default: d } = await import('debug'); debug = d('Uttori.Plugin.Render.MarkdownIt'); } catch {}

/**
 * @typedef {object} MarkdownItRendererOptionsUttori
 * @property {string} baseUrl Prefix for relative URLs, useful when the Express app is not at URI root.
 * @property {string[]} allowedExternalDomains Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org).
 * @property {boolean} disableValidation Optionally disable the built in Markdown-It link validation, large security risks when link validation is disabled.
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
 * @typedef {MarkdownIt.Options & Record<'events', Record<string, string[]>> & Record<'uttori', MarkdownItRendererOptionsUttori>} MarkdownItRendererOptions
 */

/**
 * Uttori MarkdownIt Renderer
 * @example <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 * @class
 */
class MarkdownItRenderer {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>MarkdownItRenderer.configKey</caption>
   * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-renderer-markdown-it';
  }

  /**
   * The default configuration.
   * @returns {MarkdownItRendererOptions} The default configuration.
   * @example <caption>MarkdownItRenderer.defaultConfig()</caption>
   * const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
   * @static
   */
  static defaultConfig() {
    return {
      html: false,
      xhtmlOut: false,
      breaks: false,
      langPrefix: 'language-',
      linkify: false,
      typographer: false,
      quotes: '“”‘’',
      uttori: {
        baseUrl: '',
        allowedExternalDomains: [],
        disableValidation: false,
        openNewWindow: true,
        lazyImages: true,
        footnotes: {
          referenceTag,
          definitionOpenTag,
          definitionCloseTag: '</div>\n',
        },
        toc: {
          extract: false,
          openingTag: '<nav class="table-of-contents">',
          closingTag: '</nav>',
          slugify: {
            lower: true,
          },
        },
        wikilinks: {
          slugify: {
            lower: true,
          },
        },
      },
      events: {},
    };
  }

  /**
   * Create a config that is extended from the default config.
   * @param {MarkdownItRendererOptions} config The user provided configuration.
   * @returns {MarkdownItRendererOptions} The new configration.
   */
  static extendConfig(config = MarkdownItRenderer.defaultConfig()) {
    const base = MarkdownItRenderer.defaultConfig();
    return {
      ...base,
      ...config,
      uttori: {
        ...base.uttori,
        ...(config?.uttori || {}),
        toc: {
          ...base.uttori.toc,
          ...(config?.uttori?.toc || {}),
        },
        wikilinks: {
          ...base.uttori.wikilinks,
          ...(config?.uttori?.wikilinks || {}),
        },
      },
    };
  }

  /**
   * Validates the provided configuration for required entries.
   * @param {Record<string, MarkdownItRendererOptions>} config A provided configuration to use.
   * @param {object} _context Unused
   * @example <caption>MarkdownItRenderer.validateConfig(config, _context)</caption>
   * MarkdownItRenderer.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config || !config[MarkdownItRenderer.configKey]) {
      throw new Error(`MarkdownItRenderer Config Error: '${MarkdownItRenderer.configKey}' configuration key is missing.`);
    }
    if (!config[MarkdownItRenderer.configKey].uttori) {
      throw new Error('MarkdownItRenderer Config Error: \'uttori\' configuration key is missing.');
    }
    if (!Array.isArray(config[MarkdownItRenderer.configKey].uttori.allowedExternalDomains)) {
      throw new TypeError('MarkdownItRenderer Config Error: \'uttori.allowedExternalDomains\' is missing or not an array.');
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   * @param {object} context A Uttori-like context.
   * @param {object} context.hooks An event system / hook system to use.
   * @param {Function} context.hooks.on An event registration function.
   * @param {MarkdownItRendererOptions} context.config A provided configuration to use.
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
  static register(context) {
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = MarkdownItRenderer.extendConfig(context.config[MarkdownItRenderer.configKey]);
    if (!config.events || Object.keys(config.events).length === 0) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => {
        if (typeof MarkdownItRenderer[method] !== 'function') {
          debug(`Missing function "${method}" for key "${event}"`);
          return;
        }
        context.hooks.on(event, MarkdownItRenderer[method]);
      });
    });
  }

  /**
   * Renders Markdown for a provided string with a provided context.
   * @param {string} content Markdown content to be converted to HTML.
   * @param {object} context A Uttori-like context.
   * @param {MarkdownItRendererOptions} context.config A provided configuration to use.
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
  static renderContent(content, context) {
    debug('renderContent');
    if (!context || !context.config || !context.config[MarkdownItRenderer.configKey]) {
      throw new Error('Missing configuration.');
    }
    const config = MarkdownItRenderer.extendConfig(context.config[MarkdownItRenderer.configKey]);
    return MarkdownItRenderer.render(content, config);
  }

  /**
   * Renders Markdown for a collection of Uttori documents with a provided context.
   * @param {object[]} collection A collection of Uttori documents.
   * @param {object} context A Uttori-like context.
   * @param {MarkdownItRendererOptions} context.config A provided MarkdownIt configuration to use.
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
  static renderCollection(collection, context) {
    debug('renderCollection:', collection.length);
    if (!context || !context.config || !context.config[MarkdownItRenderer.configKey]) {
      throw new Error('Missing configuration.');
    }
    /** @type {MarkdownItRendererOptions} */
    const config = MarkdownItRenderer.extendConfig(context.config[MarkdownItRenderer.configKey]);
    return collection.map((document) => {
      const html = MarkdownItRenderer.render(document.html, config);
      return { ...document, html };
    });
  }

  /**
   * Renders Markdown for a provided string with a provided MarkdownIt configuration.
   * @param {string} content Markdown content to be converted to HTML.
   * @param {MarkdownItRendererOptions} [config] A provided MarkdownIt configuration to use.
   * @returns {string} The rendered content.
   * @example <caption>MarkdownItRenderer.render(content, config)</caption>
   * const html = MarkdownItRenderer.render(content, config);
   * @static
   */
  static render(content, config = {}) {
    if (!content) {
      debug('No input provided, returning a blank string.');
      return '';
    }
    const md = new MarkdownIt(config).use(markdownItPlugin);
    if (config?.uttori?.disableValidation) {
      md.validateLink = () => true;
    }

    // Clean up the content.
    content = MarkdownItRenderer.cleanContent(content);
    return md.render(content).trim();
  }

  /**
   * Parse Markdown for a provided string with a provided MarkdownIt configuration.
   * @param {string} content Markdown content to be converted to HTML.
   * @param {MarkdownItRendererOptions} [config] A provided MarkdownIt configuration to use.
   * @returns {import('markdown-it/lib/token')[]} The rendered content.
   * @example <caption>MarkdownItRenderer.parse(content, config)</caption>
   * const tokens = MarkdownItRenderer.parse(content, config);
   * @see {@link https://markdown-it.github.io/markdown-it/#MarkdownIt.parse|MarkdownIt.parse}
   * @static
   */
  static parse(content, config = {}) {
    if (!content) {
      debug('No input provided, returning an empty array.');
      return [];
    }

    const md = new MarkdownIt(config).use(markdownItPlugin);
    if (config?.uttori?.disableValidation) {
      md.validateLink = () => true;
    }

    // Clean up the content.
    content = MarkdownItRenderer.cleanContent(content);
    return md.parse(content, {});
  }

  /**
   * Removes empty links, as these have caused issues.
   * Find missing links, and link them to the slug from the provided text.
   * @param {string} content Markdown content to be converted to HTML.
   * @returns {string} The rendered content.
   * @static
   */
  static cleanContent(content) {
    // Remove empty links, as these have caused issues.
    content = content.replace(/\[]\(\)/g, '');

    // Find missing links, and link them.
    const missingLinks = content.match(/\[(.*)]\(\s?\)/g) || [];
    if (missingLinks && missingLinks.length > 0) {
      debug('Found missing links:', missingLinks.length);
      missingLinks.forEach((match) => {
        const title = match.slice(1).slice(0, -3);
        const slug = slugify(title, { lower: true });
        content = content.replace(match, `[${title}](/${slug})`);
      });
    }

    return content;
  }

  /**
   * Will attempt to extract the table of contents when set to and add it to the view model.
   * @param {object} viewModel Markdown content to be converted to HTML.
   * @param {object} context A Uttori-like context.
   * @param {MarkdownItRendererOptions} context.config A provided configuration to use.
   * @returns {object} The view model.
   * @example <caption>MarkdownItRenderer.viewModelDetail(viewModel, context)</caption>
   * viewModel = MarkdownItRenderer.viewModelDetail(viewModel, context);
   * @static
   */
  static viewModelDetail(viewModel, context) {
    debug('viewModelDetail');
    if (!context || !context.config || !context.config[MarkdownItRenderer.configKey]) {
      throw new Error('Missing configuration.');
    }
    const config = MarkdownItRenderer.extendConfig(context.config[MarkdownItRenderer.configKey]);

    // Do we need to do anything?
    if (!config.uttori?.toc?.extract) {
      debug('No document.html provided, returning the viewModel.');
      return viewModel;
    }

    // Check for the HTML table of contents
    if (!viewModel?.document?.html) {
      debug('No document.html provided, returning the viewModel.');
      return viewModel;
    }
    if (!viewModel?.document?.html?.includes(config.uttori.toc.openingTag)) {
      debug('No table of contents found, returning the viewModel.');
      return viewModel;
    }

    // Extract the table of contents and update the HTML
    const [preToc, tocStart] = viewModel.document.html.split(config.uttori.toc.openingTag);
    const [toc, postToc] = tocStart.split(config.uttori.toc.closingTag);

    return {
      ...viewModel,
      document: {
        ...viewModel.document,
        html: `${preToc.trim()}${postToc.trim()}`,
      },
      toc: `${config.uttori.toc.openingTag?.trim()}${toc?.trim()}${config.uttori.toc.closingTag?.trim()}`,
    };
  }
}

export default MarkdownItRenderer;
