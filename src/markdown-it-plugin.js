/* eslint-disable no-console */
const MarkdownIt = require('markdown-it');
const StateBlock = require('markdown-it/lib/rules_block/state_block');
const StateInline = require('markdown-it/lib/rules_inline/state_inline');
const StateCore = require('markdown-it/lib/rules_core/state_core');
const Token = require('markdown-it/lib/token');
const Renderer = require('markdown-it/lib/renderer');

const { footnoteDefinition, footnoteReferences, configFootnoteReference, configFootnoteOpen, configFootnoteClose } = require('./footnotes');
const { headingOpen, tocOpen, tocClose, tocBody, tocRule, collectHeaders } = require('./toc');
const { wikilinks } = require('./wikilinks');
const { youtube } = require('./youtube');
const { video } = require('./video');
const { uttoriInline } = require('./uttori-inline');
const { lineBreaker } = require('./line-breaker');

/**
 * Extend MarkdownIt with Uttori specific items:
 * - Table of Contents with `[toc]`
 * - External Links with Domain Filters
 * - Footnote Support with `[^label]` & `[^label]: Definition`
 * - Image Lazyloading
 *
 * @param {MarkdownIt} md The MarkdownIt instance.
 * @returns {object} The instance of Plugin.
 */
function Plugin(md) {
  /**
   * Adds deep links to the opening of the heading tags with IDs.
   *
   * @param {Token[]} tokens Collection of tokens.
   * @param {number} index The index of the current token in the Tokens array.
   * @param {object} options The options for the current MarkdownIt instance.
   * @returns {string} The modified header tag with ID.
   */
  md.renderer.rules.heading_open = headingOpen;

  /**
   * Creates the opening tag of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @param {object} options The options for the current MarkdownIt instance.
   * @returns {string} The opening tag of the TOC.
   */
  md.renderer.rules.toc_open = tocOpen;

  /**
   * Creates the closing tag of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @param {object} options The options for the current MarkdownIt instance.
   * @returns {string} The closing tag of the TOC.
   */
  md.renderer.rules.toc_close = tocClose;

  /**
   * Creates the contents of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @param {object} _opts Option parameters of the parser instance.
   * @param {object} env Additional data from parsed input (the toc_headings, for example).
   * @param {Renderer} _slf The current parser instance.
   * @returns {string} The contents tag of the TOC.
   */
  md.renderer.rules.toc_body = tocBody;

  /**
   * Find and replace the TOC tag with the TOC itself.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @returns {boolean} Returns true when able to parse a TOC.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.inline.ruler.after('text', 'toc', tocRule);

  /**
   * Caches the headers for use in building the TOC body.
   *
   * @param {StateCore} state State of MarkdownIt.
   */
  md.core.ruler.push('collect_headers', collectHeaders);

  /**
   * Converts WikiLinks to anchor tags.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @returns {boolean} Returns true when able to parse the wikilinks.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.before|Ruler.before}
   */
  md.inline.ruler.before('link', 'wikilink', wikilinks);

  /**
   * Find and replace the <youtube> tags with safe iframes.
   *
   * @param {StateCore} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.core.ruler.after('block', 'youtube', youtube);

  /**
   * Find and replace the <video> tags with safe <video> tags.
   *
   * @param {StateCore} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.core.ruler.after('block', 'video', video);

  /**
   * Find and replace any <br /> tags in text with HTML line breaks.
   *
   * @param {StateCore} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.core.ruler.after('block', 'line-breaker', lineBreaker);

  /**
   * Uttori specific rules for manipulating the markup.
   * External Domains are filtered for SEO and security.
   *
   * @param {StateCore} state State of MarkdownIt.
   */
  md.core.ruler.after('inline', 'uttori', uttoriInline);

  /**
   * Creates the tag for the Footnote reference.
   *
   * @param {Token[]} tokens Collection of tokens to render.
   * @param {number} index The index of the current token in the Tokens array.
   * @param {object} _opts Option parameters of the parser instance.
   * @param {object} _env Additional data from parsed input (references, for example).
   * @param {Renderer} _slf The current parser instance.
   * @returns {string} The tag for the Footnote reference.
   */
  md.renderer.rules.footnote_ref = configFootnoteReference;

  /**
   * Creates the opening tag of the Footnote items block.
   *
   * @param {Token[]} tokens Collection of tokens to render.
   * @param {number} index The index of the current token in the Tokens array.
   * @param {object} _opts Option parameters of the parser instance.
   * @param {object} _env Additional data from parsed input (references, for example).
   * @param {Renderer} _slf The current parser instance.
   * @returns {string} The opening tag of the Footnote items block.
   */
  md.renderer.rules.footnote_open = configFootnoteOpen;

  /**
   * Creates the closing tag of the Footnote items block.
   *
   * @param {Token[]} _tokens Collection of tokens to render.
   * @param {number} _index The index of the current token in the Tokens array.
   * @param {object} _opts Option parameters of the parser instance.
   * @param {object} _env Additional data from parsed input (references, for example).
   * @param {Renderer} _slf The current parser instance.
   * @returns {string} The closing tag of the Footnote section block.
   */
  md.renderer.rules.footnote_close = configFootnoteClose;

  /**
   * Converts Footnote definitions to linkable anchor tags.
   *
   * @param {StateBlock} state State of MarkdownIt.
   * @param {number} startLine The starting line of the block.
   * @param {number} endLine The ending line of the block.
   * @param {boolean} silent Used to validating parsing without output in MarkdownIt.
   * @returns {boolean} Returns if parsing was successful or not.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.before|Ruler.before}
   */
  md.block.ruler.before('reference', 'footnote_def', footnoteDefinition, { alt: ['paragraph', 'reference'] });

  /**
   * Converts Footnote definitions to linkable anchor tags.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @param {boolean} silent Used to validating parsing without output in MarkdownIt.
   * @returns {boolean} Returns if parsing was successful or not.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.inline.ruler.after('image', 'footnote_ref', footnoteReferences);

  return this;
}

module.exports = Plugin;
