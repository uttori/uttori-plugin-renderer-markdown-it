/**
 * Converts Footnote definitions to linkable anchor tags.
 * @param {import('markdown-it/lib/rules_block/state_block')} state State of MarkdownIt.
 * @param {number} startLine The starting line of the block.
 * @param {number} endLine The ending line of the block.
 * @param {boolean} silent Used to validating parsing without output in MarkdownIt.
 * @returns {boolean} Returns if parsing was successful or not.
 * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.before|Ruler.before}
 */
export function footnoteDefinition(state: any, startLine: number, endLine: number, silent: boolean): boolean;
/**
 * Converts Footnote definitions to linkable anchor tags.
 * @param {import('markdown-it/lib/rules_inline/state_inline')} state State of MarkdownIt.
 * @param {boolean} silent Used to validating parsing without output in MarkdownIt.
 * @returns {boolean} Returns if parsing was successful or not.
 * @see {@link https://markdown-it.github.io/markdown-it/#Ruler.after|Ruler.after}
 */
export function footnoteReferences(state: any, silent: boolean): boolean;
/**
 * Default configuration for rendering footnote references.
 * @param {object} token The MarkdownIt Token meta object.
 * @param {number} token.id The ID of the current footnote.
 * @param {string} token.label The label of the current footnote.
 * @returns {string} The HTML markup for the current footnote reference.
 */
export function referenceTag({ id, label }: {
    id: number;
    label: string;
}): string;
/**
 * Default configuration for rendering footnote definitions.
 * @param {object} token The MarkdownIt Token meta object.
 * @param {number} token.id The ID of the current footnote.
 * @param {string} token.label The label of the current footnote.
 * @returns {string} The HTML markup for the current footnote definition.
 */
export function definitionOpenTag({ id, label }: {
    id: number;
    label: string;
}): string;
/**
 * Creates the tag for the Footnote reference.
 * @param {import('markdown-it/lib/token')[]} tokens Collection of tokens to render.
 * @param {number} index The index of the current token in the Tokens array.
 * @param {MarkdownIt.Options} options Option parameters of the parser instance.
 * @param {object} _env Additional data from parsed input (references, for example).
 * @param {import('markdown-it/lib/renderer')} _slf The current parser instance.
 * @returns {string} The tag for the Footnote reference.
 */
export function configFootnoteReference(tokens: any[], index: number, options: MarkdownIt.Options, _env: object, _slf: any): string;
/**
 * Creates the opening tag of the Footnote items block.
 * @param {import('markdown-it/lib/token')[]} tokens Collection of tokens to render.
 * @param {number} index The index of the current token in the Tokens array.
 * @param {MarkdownIt.Options} options Option parameters of the parser instance.
 * @param {object} _env Additional data from parsed input (references, for example).
 * @param {import('markdown-it/lib/renderer')} _slf The current parser instance.
 * @returns {string} The opening tag of the Footnote items block.
 */
export function configFootnoteOpen(tokens: any[], index: number, options: MarkdownIt.Options, _env: object, _slf: any): string;
/**
 * Creates the closing tag of the Footnote items block.
 * @param {import('markdown-it/lib/token')[]} _tokens Collection of tokens to render.
 * @param {number} _index The index of the current token in the Tokens array.
 * @param {MarkdownIt.Options} options Option parameters of the parser instance.
 * @param {object} _env Additional data from parsed input (references, for example).
 * @param {import('markdown-it/lib/renderer')} _slf The current parser instance.
 * @returns {string} The closing tag of the Footnote section block.
 */
export function configFootnoteClose(_tokens: any[], _index: number, options: MarkdownIt.Options, _env: object, _slf: any): string;
declare namespace _default {
    export { footnoteDefinition };
    export { footnoteReferences };
    export { referenceTag };
    export { definitionOpenTag };
    export { configFootnoteReference };
    export { configFootnoteOpen };
    export { configFootnoteClose };
}
export default _default;
import MarkdownIt from 'markdown-it';
//# sourceMappingURL=footnotes.d.ts.map