/**
 * Adds deep links to the opening of the heading tags with IDs.
 * @param {import('markdown-it/lib/token')[]} tokens Collection of tokens.
 * @param {number} index The index of the current token in the Tokens array.
 * @param {MarkdownIt.Options} options The options for the current MarkdownIt instance.
 * @returns {string} The modified header tag with ID.
 */
export function headingOpen(tokens: any[], index: number, options: MarkdownIt.Options): string;
/**
 * Creates the opening tag of the TOC.
 * @param {import('markdown-it/lib/token')[]} _tokens Collection of tokens.
 * @param {number} _index The index of the current token in the Tokens array.
 * @param {object} options The options for the current MarkdownIt instance.
 * @returns {string} The opening tag of the TOC.
 */
export function tocOpen(_tokens: any[], _index: number, options: object): string;
/**
 * Creates the closing tag of the TOC.
 * @param {import('markdown-it/lib/token')[]} _tokens Collection of tokens.
 * @param {number} _index The index of the current token in the Tokens array.
 * @param {object} options The options for the current MarkdownIt instance.
 * @returns {string} The closing tag of the TOC.
 */
export function tocClose(_tokens: any[], _index: number, options: object): string;
/**
 * Creates the contents of the TOC.
 * @param {import('markdown-it/lib/token')[]} _tokens Collection of tokens.
 * @param {number} _index The index of the current token in the Tokens array.
 * @param {object} options Option parameters of the parser instance.
 * @param {object} env Additional data from parsed input (the toc_headings, for example).
 * @param {import('markdown-it/lib/renderer')} _slf The current parser instance.
 * @returns {string} The contents tag of the TOC.
 */
export function tocBody(_tokens: any[], _index: number, options: object, env: object, _slf: any): string;
/**
 * Find and replace the TOC tag with the TOC itself.
 * @param {import('markdown-it/lib/rules_inline/state_inline')} state State of MarkdownIt.
 * @returns {boolean} Returns true when able to parse a TOC.
 * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
 */
export function tocRule(state: any): boolean;
/**
 * Caches the headers for use in building the TOC body.
 * @param {import('markdown-it/lib/rules_core/state_core')} state State of MarkdownIt.
 */
export function collectHeaders(state: any): void;
declare namespace _default {
    export { headingOpen };
    export { tocOpen };
    export { tocClose };
    export { tocBody };
    export { tocRule };
    export { collectHeaders };
}
export default _default;
import MarkdownIt from 'markdown-it';
//# sourceMappingURL=toc.d.ts.map