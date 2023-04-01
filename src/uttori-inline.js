const StateCore = require('markdown-it/lib/rules_core/state_core');
const Token = require('markdown-it/lib/token');

/**
 * @param {Token} token The MarkdownIt token we are reading.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @returns {*|undefined} The read value or undefined.
 */
function getValue(token, key) {
  let value;
  token.attrs.forEach((attribute) => {
    // Parameter is set, read it.
    if (attribute[0] === key) {
      /* eslint-disable prefer-destructuring */
      value = attribute[1];
    }
  });
  // Parameter is not set, return undefined.
  return value;
}

/**
 * @param {Token} token The MarkdownIt token we are updating.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @param {string} value The value we want to set to the provided key.
 */
function updateValue(token, key, value) {
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
}

/**
 * Uttori specific rules for manipulating the markup.
 * External Domains are filtered for SEO and security.
 *
 * @param {StateCore} state State of MarkdownIt.
 * @returns {boolean} Returns if parsing was successful or not.
 */
function uttoriInline(state) {
  state.tokens.forEach((blockToken) => {
    if (blockToken.type === 'inline' && blockToken.children) {
      // https://markdown-it.github.io/markdown-it/#Token
      blockToken.children.forEach((token) => {
        switch (token.type) {
          case 'image': {
            if (state.md.options?.uttori?.lazyImages) {
              updateValue(token, 'loading', 'lazy');
            }
            break;
          }
          case 'link_open': {
            const href = getValue(token, 'href');
            if (href) {
              // Absolute URLs
              if (href.startsWith('http://') || href.startsWith('https://')) {
                const url = new URL(href);
                // If a domain is not in this list, it is set to 'nofollow'.
                if (state.md.options?.uttori?.allowedExternalDomains?.includes(url.hostname)) {
                  updateValue(token, 'rel', 'external noopener noreferrer');
                } else {
                  updateValue(token, 'rel', 'external nofollow noopener noreferrer');
                }
                // Open external domains in a new window.
                if (state.md.options?.uttori?.openNewWindow) {
                  updateValue(token, 'target', '_blank');
                }
              } else if (href.startsWith('color:')) {
                // Convert the anchor tag to a span tag and add the link as the class.
                token.tag = 'span';
                token.attrs = [
                  ['style', `color: ${href.slice(6)}`],
                ];
              } else {
                // Prefix for relative URLs
                // eslint-disable-next-line no-lonely-if
                if (state.md.options?.uttori?.baseUrl) {
                  // Check for opening slash
                  updateValue(token, 'href', `${state.md.options.uttori.baseUrl}${href.startsWith('/') ? href : `/${href}`}`);
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
}

module.exports = {
  getValue,
  updateValue,
  uttoriInline,
};
