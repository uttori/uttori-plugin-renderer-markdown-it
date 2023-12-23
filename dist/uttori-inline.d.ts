/**
 * @param {import('markdown-it/lib/token')} token The MarkdownIt token we are reading.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @returns {*|undefined} The read value or undefined.
 */
export function getValue(token: any, key: string): any | undefined;
/**
 * @param {import('markdown-it/lib/token')} token The MarkdownIt token we are updating.
 * @param {string} key The key is the attribute name, like `src` or `href`.
 * @param {string} value The value we want to set to the provided key.
 */
export function updateValue(token: any, key: string, value: string): void;
/**
 * Uttori specific rules for manipulating the markup.
 * External Domains are filtered for SEO and security.
 * @param {import('markdown-it/lib/rules_core/state_core')} state State of MarkdownIt.
 * @returns {boolean} Returns if parsing was successful or not.
 */
export function uttoriInline(state: any): boolean;
declare namespace _default {
    export { getValue };
    export { updateValue };
    export { uttoriInline };
}
export default _default;
//# sourceMappingURL=uttori-inline.d.ts.map