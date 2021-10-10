/* eslint-disable no-console */
const MarkdownIt = require('markdown-it');
const StateInline = require('markdown-it/lib/rules_inline/state_inline');
const StateCore = require('markdown-it/lib/rules_core/state_core');
const Token = require('markdown-it/lib/token');
const slugify = require('slugify');

/**
 * @param {Token} token The MarkdownIt token we are reading.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @returns {*|undefined} The read value or undefined.
 */
const getValue = (token, key) => {
  let value;
  token.attrs.forEach((attribute) => {
    // Parameter is set, read it.
    /* istanbul ignore else */
    if (attribute[0] === key) {
      /* eslint-disable prefer-destructuring */
      value = attribute[1];
    }
  });
  // Parameter is not set, return undefined.
  return value;
};

/**
 * @param {Token} token The MarkdownIt token we are updating.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @param {string} value The value we want to set to the provided key.
 */
const updateValue = (token, key, value) => {
  let found;
  token.attrs.forEach((attribute) => {
    // Parameter is set, change it.
    if (attribute[0] === key) {
      attribute[1] = value;
      found = true;
    }
  });
  // Parameter is not set, add it.
  if (!found) {
    token.attrs.push([key, value]);
  }
};

/**
 * Extend MarkdownIt with Uttori specific items:
 * - Table of Contents with `[toc]`
 * - External Links with Domain Filters
 *
 * @param {MarkdownIt} md The MarkdownIt instance.
 * @param {object} pluginOptions Options for the plugin instance.
 * @returns {object} The instance of Plugin.
 */
function Plugin(md, pluginOptions = {}) {
  const headings = [];

  // Find Options, `new MarkdownIt({ ..., uttori: { ... } })` or `.use({ ... })`
  let options = {};
  /* istanbul ignore next */
  if (md.options.uttori) {
    options = md.options.uttori;
  } else if (pluginOptions) {
    options = pluginOptions;
  } else {
    return false;
  }

  /**
   * Adds deep links to the opening of the heading tags with IDs.
   *
   * @param {Token[]} tokens Collection of tokens.
   * @param {number} index The index of the current token in the Tokens array.
   * @returns {string} The modified header tag with ID.
   */
  md.renderer.rules.heading_open = (tokens, index) => {
    // The opening tag itself (#, ##, etc.)
    const { tag } = tokens[index];
    // The text content inside of that tag (# Heading, Heading in this example)
    const label = tokens[index + 1];
    // Guard against empty headers
    if (label.type === 'inline' && label.children.length > 0) {
      // We want to use slugify to provide nicer deep links
      const slug = slugify(label.content, options.toc.slugify);
      // Return the new tag HTML
      return `<${tag} id="${slug}-${label.map[0]}">`;
    }
    return `<${tag}>`;
  };

  /**
   * Creates the opening tag of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @returns {string} The opening tag of the TOC.
   */
  md.renderer.rules.toc_open = (_tokens, _index) => options.toc.openingTag;

  /**
   * Creates the closing tag of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @returns {string} The closing tag of the TOC.
   */
  md.renderer.rules.toc_close = (_tokens, _index) => options.toc.closingTag;

  /**
   * Creates the contents of the TOC.
   *
   * @param {Token[]} _tokens Collection of tokens.
   * @param {number} _index The index of the current token in the Tokens array.
   * @returns {string} The contents tag of the TOC.
   */
  md.renderer.rules.toc_body = (_tokens, _index) => {
    let indent_level = 0;

    // Reduce the headers down into a string of the TOC
    const list = headings.reduce((accumulator, heading) => {
      // Increase / Decrease depth of nesting
      if (heading.level > indent_level) {
        const level_diff = (heading.level - indent_level);
        for (let i = 0; i < level_diff; i++) {
          accumulator += `<ul class="table-of-contents-h${heading.level}">`;
          indent_level++;
        }
      } else if (heading.level < indent_level) {
        const level_diff = (indent_level - heading.level);
        for (let i = 0; i < level_diff; i++) {
          accumulator += '</ul>';
          indent_level--;
        }
      }
      // New item at the current level
      accumulator += `<li><a href="#${heading.slug}-${heading.index}" title="${heading.content}">${heading.content}</a></li>`;
      return accumulator;
    }, '');

    // Add the ending tags at the number of indent levels nested
    let output = `${list}${'</ul>'.repeat(indent_level)}`;

    // Remove empty nesting levels that result from missing levels, such as no H1 or H2 tags.
    while (output.includes('<ul class="table-of-contents-h2"><ul')) {
      output = output.replace('<ul class="table-of-contents-h2"><ul', '<ul');
      output = output.replace('</ul></ul>', '</ul>');
    }
    while (output.includes('<ul class="table-of-contents-h3"><ul')) {
      output = output.replace('<ul class="table-of-contents-h3"><ul', '<ul');
      output = output.replace('</ul></ul>', '</ul>');
    }
    return output;
  };

  /**
   * Converts WikiLinks to anchor tags.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.inline.ruler.before('link', 'wikilink', (state) => {
    const max = state.posMax;
    let current = state.src.charAt(state.pos);
    let next = state.src.charAt(state.pos + 1);

    // Check for opening brackets `[[`
    if (current !== '[' || next !== '[') {
      return false;
    }

    // Simple parser to find the closing tags
    let openTagCount = 1;
    let end = -1;
    let skipNext = false;
    let text = '';
    for (let i = state.pos + 1; i < max && end === -1; i++) {
      current = next;
      next = state.src.charAt(i + 1);
      text += next;
      if (skipNext) {
        skipNext = false;
        continue;
      }
      if (current === '\n') {
        // Bad input, abort
        return false;
      }
      if (current === ']' && next === ']') {
        openTagCount -= 1;
        // Last closing tag found
        if (openTagCount === 0) {
          end = i;
        }
        // Skip the next `]`
        skipNext = true;
      } else if (current === '[' && next === '[') {
        openTagCount += 1;
        // Skip the next `[`
        skipNext = true;
      } else if (current === '\\') {
        // Escape character, skip
        skipNext = true;
      }
    }

    // No closing tag, bad input
    if (end === -1) {
      return false;
    }

    // Build the links parts
    const parts = text.slice(0, -2).split('|');
    const link = slugify(parts[0], options.wikilinks.slugify);
    const anchor_text = parts.length > 1 && parts[1] ? parts[1] : parts[0];

    // Create our tag
    let token = state.push('link_open', 'a', 1);
    token.attrs = [['href', link]];

    state.pos += 2;
    state.posMax = end;

    // We want to use the provided text if any, rather than the whole internal string.
    // state.md.inline.tokenize(state);
    token = state.push('text', '', 0);
    token.content = anchor_text;

    state.pos = end + 2;
    state.posMax = max;
    state.push('link_close', 'a', -1);

    return true;
  });

  /**
   * Find and replace the TOC tag with the TOC itself.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.inline.ruler.after('text', 'toc', (state) => {
    // If the token does not start with `[` it cannot be `[toc]`
    if (state.src.charCodeAt(state.pos) !== 0x5B) {
      return false;
    }

    const match = /^\[toc]$/im.exec(state.src) || [];
    if (!match || match.length === 0 || match[0] !== '[toc]') {
      return false;
    }

    let token;
    token = state.push('toc_open', 'toc', 1);
    token.markup = '[toc]';
    token = state.push('toc_body', '', 0);
    token.content = '';
    state.push('toc_close', 'toc', -1);

    // Update the position and continue parsing.
    const newline = state.src.indexOf('\n', state.pos);
    /* istanbul ignore next */
    state.pos = (newline !== -1) ? newline : state.pos + state.posMax + 1;

    return true;
  });

  /**
   * Find and replace the <youtube> tags with safe iframes.
   *
   * @param {StateInline} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.core.ruler.after('block', 'youtube', (state) => {
    const tokens = state.tokens;

    // Keep track of paragraph tags to remove.
    const toRemove = [];
    for (let i = tokens.length - 1; i >= 0; i--) {
      const currentToken = tokens[i];
      if (currentToken.type !== 'inline') continue;

      // Does it start with "<youtube" and seem real?
      const youtubeRegExp = new RegExp(/<youtube\s[^>]*?(v|start|width|height|title)=["']([^"']*?)["'][^>]*?>/g);
      if (!youtubeRegExp.test(currentToken.content)) continue;

      // Found a tag
      toRemove.push(i);

      // Pull the parts out of the tag:
      // <youtube v="XG9dCoTlJYA" start="0" width="560" height="315" title="YouTube Video Player" start="0">
      const parts = [...currentToken.content.matchAll(/\s+(v|start|width|height|title)=('[^']*'|"[^"]*")?/g)];
      const keys = parts.reduce((output, item) => {
        output[item[1]] = item[2].replace(/["']+/g, '');
        return output;
      }, {});
      const { v, width = 560, height = 315, title = '', start = 0 } = keys;

      // Build the tokens
      const nodes = [];
      let level = currentToken.level;

      let token = new state.Token('div_open', 'div', 1);
      token.attrs = [['class', 'youtube-embed']];
      token.level = level++;
      nodes.push(token);

      token = new state.Token('iframe_open', 'iframe', 1);
      token.attrs = [
        ['class', 'youtube-embed-video'],
        ['width', width],
        ['height', height],
        ['src', `https://www.youtube-nocookie.com/embed/${v}?start=${start}`],
        ['title', title],
        ['frameborder', 0],
        ['allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'],
        ['allowfullscreen', true],
      ];
      nodes.push(token);
      token = new state.Token('iframe_close', 'iframe', -1);
      nodes.push(token);

      token = new state.Token('div_close', 'div', -1);
      token.level = --level;
      nodes.push(token);

      // Remove closing P tag
      tokens.splice(i - 1, 1);
      // Replace inline content with new tags
      state.tokens = md.utils.arrayReplaceAt(tokens, i, nodes);
      // Remove opening P tag
      state.tokens.splice(i + 4, 1);
    }
  });

  /**
   * Caches the headers for use in building the TOC body.
   *
   * @param {StateCore} state State of MarkdownIt.
   * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
   */
  md.core.ruler.push('collect_headers', (state) => {
    // Create a mapping of all the headers, their indentation level, content and slug.
    state.tokens.forEach((token, i, tokens) => {
      if (token.type === 'heading_close') {
        const inline = tokens[i - 1];
        headings.push({
          content: inline.content,
          index: inline.map[0],
          level: Number.parseInt(token.tag.slice(1, 2), 10),
          slug: slugify(inline.content, options.toc.slugify),
        });
      }
    });
  });

  /**
   * Uttori specific rules for manipulating the markup.
   * External Domains are filtered for SEO and security.
   *
   * @param {StateCore} state State of MarkdownIt.
   */
  md.core.ruler.after('inline', 'uttori', (state) => {
    state.tokens.forEach((blockToken) => {
      if (blockToken.type === 'inline' && blockToken.children) {
        // https://markdown-it.github.io/markdown-it/#Token
        blockToken.children.forEach((token) => {
          switch (token.type) {
            case 'image': {
              if (options.lazyImages) {
                updateValue(token, 'loading', 'lazy');
              }
              break;
            }
            case 'link_open': {
              const href = getValue(token, 'href');
              /* istanbul ignore else */
              if (href) {
                // Absolute URLs
                if (href.startsWith('http://') || href.startsWith('https://')) {
                  const url = new URL(href);
                  // If a domain is not in this list, it is set to 'nofollow'.
                  if (options.allowedExternalDomains.includes(url.hostname)) {
                    updateValue(token, 'rel', 'external noopener noreferrer');
                  } else {
                    updateValue(token, 'rel', 'external nofollow noopener noreferrer');
                  }
                  // Open external domains in a new window.
                  if (options.openNewWindow) {
                    updateValue(token, 'target', '_blank');
                  }
                } else {
                  // Prefix for relative URLs
                  // eslint-disable-next-line no-lonely-if
                  if (options.baseUrl) {
                    // Check for opening slash
                    updateValue(token, 'href', `${options.baseUrl}${href.startsWith('/') ? href : `/${href}`}`);
                  }
                }
              }
              break;
            }
            default:
              break;
          }
        });
      }
    });

    return false;
  });

  return this;
}

module.exports = Plugin;
