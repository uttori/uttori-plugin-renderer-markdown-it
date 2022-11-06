/** @type {Function} */
let debug = () => {}; try { debug = require('debug')('Uttori.Plugin.Render.MarkdownIt'); } catch {}
const MarkdownIt = require('markdown-it');
const slugify = require('slugify').default;
const markdownItPlugin = require('./markdown-it-plugin');
const { referenceTag, definitionOpenTag } = require('./footnotes');

/**
 * @typedef {object} MarkdownItRendererOptions
 * @property {boolean} [html=false] Enable HTML tags in source.
 * @property {boolean} [xhtmlOut=false] Use '/' to close single tags (<br />).
 * @property {boolean} [breaks=false] Convert '\n' in paragraphs into <br>, this is only for full CommonMark compatibility.
 * @property {string} [langPrefix='language-'] CSS language prefix for fenced blocks. Can be useful for external highlighters.
 * @property {boolean} [linkify=false] Autoconvert URL-like text to links.
 * @property {boolean} [typographer=false] Enable some language-neutral replacement + quotes beautification.
 * @property {string} [quotes='“”‘’'] Double + single quotes replacement pairs, when typographer enabled, and smartquotes on. Could be either a String or an Array. For example, you can use '«»„“' for Russian, '„“‚‘' for German, and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
 * @property {Function} [highlight] Highlighter function. Should return escaped HTML, or '' if the source string is not changed and should be escaped externally. If result starts with <pre... internal wrapper is skipped.
 * @property {object} [events={}] Events to listen for.
 * @property {object} [uttori={}] Custom values for Uttori specific use.
 * @property {string} [uttori.baseUrl=''] Prefix for relative URLs, useful when the Express app is not at URI root.
 * @property {string[]} [uttori.allowedExternalDomains=[]] Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org).
 * @property {boolean} [uttori.openNewWindow=true] Open external domains in a new window.
 * @property {boolean} [uttori.lazyImages=true] Add lazy loading params to image tags.
 * @property {object} [uttori.footnotes={}] Footnote settings.
 * @property {Function} [uttori.footnotes.referenceTag] A funciton to return the default HTML for a footnote reference.
 * @property {Function} [uttori.footnotes.definitionOpenTag] A funciton to return the default opening HTML for a footnote definition.
 * @property {string} [uttori.footnotes.definitionCloseTag='</div>\n'] The default closing HTML for a footnote definition.
 * @property {object} [uttori.toc={}] Table of Contents settings.
 * @property {boolean} [uttori.toc.extract=false] When true, extract the table of contents to the view model from the content.
 * @property {string} [uttori.toc.openingTag='<nav class&#61;"table-of-contents">'] The opening DOM tag for the TOC container.
 * @property {string} [uttori.toc.closingTag='</nav>'] The closing DOM tag for the TOC container.
 * @property {object} [uttori.toc.slugify={ lower: true }] Slugify options for convering headings to anchor links.
 * @property {object} [uttori.wikilinks={}] WikiLinks settings.
 * @property {object} [uttori.wikilinks.slugify={ lower: true }] Slugify options for convering Wikilinks to anchor links.
 */

/**
 * Uttori MarkdownIt Renderer
 *
 * @example <caption>MarkdownItRenderer</caption>
 * const content = MarkdownItRenderer.render("...");
 * @class
 */
class MarkdownItRenderer {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   *
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
   *
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
    };
  }

  /**
   * Create a config that is extended from the default config.
   *
   * @param {MarkdownItRendererOptions} [config={}] The user provided configuration.
   * @returns {MarkdownItRendererOptions} The new configration.
   */
  static extendConfig(config = {}) {
    return {
      ...MarkdownItRenderer.defaultConfig(),
      ...config,
      uttori: {
        ...MarkdownItRenderer.defaultConfig().uttori,
        ...(config.uttori ? config.uttori : {}),
        toc: {
          ...MarkdownItRenderer.defaultConfig().uttori.toc,
          ...(config.uttori && config.uttori.toc ? config.uttori.toc : {}),
        },
        wikilinks: {
          ...MarkdownItRenderer.defaultConfig().uttori.wikilinks,
          ...(config.uttori && config.uttori.wikilinks ? config.uttori.wikilinks : {}),
        },
      },
    };
  }

  /**
   * Validates the provided configuration for required entries.
   *
   * @param {object} config - A configuration object.
   * @param {MarkdownItRendererOptions} config.configKey - A configuration object specifically for this plugin.
   * @param {object} _context - Unused
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
   *
   * @param {object} context - A Uttori-like context.
   * @param {object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
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
    if (!config.events) {
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
   *
   * @param {string} content - Markdown content to be converted to HTML.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
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
   *
   * @param {object[]} collection - A collection of Uttori documents.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
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
    const config = MarkdownItRenderer.extendConfig(context.config[MarkdownItRenderer.configKey]);
    return collection.map((document) => {
      const html = MarkdownItRenderer.render(document.html, config);
      return { ...document, html };
    });
  }

  /**
   * Renders Markdown for a provided string with a provided MarkdownIt configuration.
   *
   * @param {string} content - Markdown content to be converted to HTML.
   * @param {object} config - A provided MarkdownIt configuration to use.
   * @returns {string} The rendered content.
   * @example <caption>MarkdownItRenderer.render(content, config)</caption>
   * const html = MarkdownItRenderer.render(content, config);
   * @static
   */
  static render(content, config) {
    if (!content) {
      debug('No input provided, returning a blank string.');
      return '';
    }

    const md = new MarkdownIt(config).use(markdownItPlugin);

    // Remove empty links, as these have caused issues.
    content.replace(/\[]\(\)/g, '');

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

    return md.render(content).trim();
  }

  /**
   * Will attempt to extract the table of contents when set to and add it to the view model.
   *
   * @param {object} viewModel - Markdown content to be converted to HTML.
   * @param {object} context - A Uttori-like context.
   * @param {object} context.config - A provided configuration to use.
   * @param {object} context.config.uttori - A provided configuration to use.
   * @param {object} context.config.uttori.toc - A provided configuration to use.
   * @param {boolean}  context.config.uttori.toc.extract When true, extract the table of contents to the view model from the content.
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
    if (!config.uttori.toc.extract) {
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
      toc: `${config.uttori.toc.openingTag.trim()}${toc?.trim()}${config.uttori.toc.closingTag.trim()}`,
    };
  }
}

module.exports = MarkdownItRenderer;
