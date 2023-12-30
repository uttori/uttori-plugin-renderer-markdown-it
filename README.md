[![view on npm](https://img.shields.io/npm/v/@uttori/plugin-renderer-markdown-it.svg)](https://www.npmjs.com/package/@uttori/plugin-renderer-markdown-it)
[![npm module downloads](https://img.shields.io/npm/dt/@uttori/plugin-renderer-markdown-it)](https://www.npmjs.com/package/@uttori/plugin-renderer-markdown-it)
[![Build Status](https://travis-ci.com/uttori/uttori-plugin-renderer-markdown-it.svg?branch=master)](https://app.travis-ci.com/github/uttori/uttori-plugin-renderer-markdown-it)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-renderer-markdown-it/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-renderer-markdown-it?branch=master)

# Uttori Renderer - Markdown - MarkdownIt

Uttori renderer support for Markdown powered by [MarkdownIt](https://markdown-it.github.io/).

This also includes a MarkdownIt plugin you can use seperately that supports:

* Generate a Table of Contents based on `H#` header tags with `[toc]`
* Adding a URL prefix
* Properly handle external domains with `noopener noreferrer` and optionally set up allowed domains for `nofollow` SEO support to curb spam
* Support for `[^1] ... [^1]: Footnote` Footnotes based on [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
* Support for [WikiLinks](https://en.wikipedia.org/wiki/Help:Link#Wikilinks_(internal_links)) style linking
* Support for adding [Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) tags to `img` tags
* Support for adding YouTube iframe videos
* Support for `<br> or <br/> or <br />` style line breaks anywhere, useful for tables
* Support for `<video src="/uploads/example.mp4">` video embeds with allowed domains filtering
* Support for adding color to spans with `[Text](color:#ffadad)`
* Parse to tokens for building an AST (abstract syntax tree) using `MarkdownItRenderer.parse(content, config)`

## Install

```bash
npm install --save @uttori/plugin-renderer-markdown-it
```

## Config

Configuration outside of registration events and Uttori specific items is avaliable by passing in [MarkdownIt](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) config.

```js
{
  // Registration Events
  events: {
    renderContent: [],
    renderCollection: [],
    validateConfig: [],
    viewModelDetail: [],
  },

  // MarkdownIt Configuration
  // Enable HTML tags in source
  html: false,

  // Use '/' to close single tags (<br />).
  xhtmlOut: false,

  // Convert '\n' in paragraphs into <br>, this is only for full CommonMark compatibility.
  breaks: false,

  // CSS language prefix for fenced blocks. Can be useful for external highlighters.
  langPrefix: 'language-',

  // Autoconvert URL-like text to links.
  linkify: false,

  // Enable some language-neutral replacement + quotes beautification.
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled, and smartquotes on. Could be either a String or an Array.
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German, and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML, or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  // highlight: (/* str, lang */) => '',

  // Any other supported MarkdownIt configuration
  ...,

  // Custom Values for Uttori Specific Use
  uttori: {
    // Prefix for relative URLs, useful when the Express app is not at root.
    baseUrl: '',

    // Good Noodle List, f a domain is not in this list, it is set to 'external nofollow noreferrer'.
    allowedExternalDomains: [],

    // Open external domains in a new window.
    openNewWindow: true,

    // Add lazy loading params to image tags.
    lazyImages: true,

    // Footnotes
    footnotes: {
      // A funciton to return the default HTML for a footnote reference.
      referenceTag: ({ id, label }) => {
        return `...`;
      },

      // A funciton to return the default opening HTML for a footnote definition.
      definitionOpenTag: ({ id, label }) => {
        return `...`;
      },

      // The default closing HTML for a footnote definition.
      definitionCloseTag: '</div>\n',
    },

    // Table of Contents
    toc: {
      // The opening DOM tag for the TOC container.
      openingTag: '<nav class="table-of-contents">',

      // The closing DOM tag for the TOC container.
      closingTag: '</nav>',

      // Slugify options for convering headings to anchor links.
      slugify: {
        lower: true,
      },
    },

    // WikiLinks
    wikilinks: {
      // Slugify options for convering Wikilinks to anchor links.
      slugify: {
        lower: true,
      },
    },
  },
}
```

### Table of Contents Generation

You can generate a table of contents based on the headers in a file. Example:

```md
# First
## Second
### Third
### Third Again
#### Fouth

## Second Again
### Third Last
Content

[toc]
```

Will render to a minified version of:

```html
<p>
  <nav class="table-of-contents">
    <ul class="table-of-contents-h1">
      <li><a href="#first-0" title="First">First</a></li>
      <li><ul class="table-of-contents-h2">
        <li><a href="#second-1" title="Second">Second</a></li>
        <li><ul class="table-of-contents-h3">
          <li><a href="#third-2" title="Third">Third</a></li>
          <li><a href="#third-again-3" title="Third Again">Third Again</a></li>
          <li><ul class="table-of-contents-h4">
            <li><a href="#fouth-4" title="Fouth">Fouth</a></li>
          </ul></li>
        </ul></li>
        <li><a href="#second-again-6" title="Second Again">Second Again</a></li>
        <li><ul class="table-of-contents-h3">
          <li><a href="#third-last-7" title="Third Last">Third Last</a></li>
        </ul></li>
      </ul></li>
    </ul>
  </nav>
  Content Content
</p>
```

### Footnotes

This allos for adding footnotes & their definitions.

```md

`ADC (dp,X)`[^1]

[^1]: Add 1 cycle if m=0 (16-bit memory/accumulator)
```

### YouTube Embedding

This allows safe embedding of YouTube videos. Example:

```md
<youtube v="XG9dCoTlJYA" start="0" width="560" height="315" title="YouTube Video Player" start="0">
```

Will render to a minified version of:

```html
<div class="youtube-embed">
  <iframe class="youtube-embed-video" width="560" height="315" src="https://www.youtube-nocookie.com/embed/aR3fVuLEtj8?start=0" title="YouTube Video Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true"></iframe>
</div>
```

The only required parameter is `v`:

```md
<youtube v="aR3fVuLEtj8">
```

Will render to a minified version of:

```html
<div class="youtube-embed">
  <iframe class="youtube-embed-video" width="560" height="315" src="https://www.youtube-nocookie.com/embed/aR3fVuLEtj8?start=0" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true"></iframe>
</div>
```

### Colored Text

You can add colored text with special links:

```md
[Text](color:#ffadad)
[Text](color:#ffd6a5)
[Text](color:#fdffb6)
[Text](color:#caffbf)
[Text](color:#9bf6ff)
[Text](color:#A0C4FF)
[Text](color:#bdb2ff)
[Text](color:#ffcff8)
[Text](color:#fffffc)
[Text](color:rgba(0,0,0,0.5))
```

* * *

## API Reference

## Classes

<dl>
<dt><a href="#MarkdownItRenderer">MarkdownItRenderer</a></dt>
<dd><p>Uttori MarkdownIt Renderer</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#MarkdownItRendererOptions">MarkdownItRendererOptions</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="MarkdownItRenderer"></a>

## MarkdownItRenderer
Uttori MarkdownIt Renderer

**Kind**: global class  

* [MarkdownItRenderer](#MarkdownItRenderer)
    * [.configKey](#MarkdownItRenderer.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#MarkdownItRenderer.defaultConfig) ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
    * [.extendConfig(config)](#MarkdownItRenderer.extendConfig) ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
    * [.validateConfig(config, _context)](#MarkdownItRenderer.validateConfig)
    * [.register(context)](#MarkdownItRenderer.register)
    * [.renderContent(content, context)](#MarkdownItRenderer.renderContent) ⇒ <code>string</code>
    * [.renderCollection(collection, context)](#MarkdownItRenderer.renderCollection) ⇒ <code>Array.&lt;object&gt;</code>
    * [.render(content, [config])](#MarkdownItRenderer.render) ⇒ <code>string</code>
    * [.parse(content, [config])](#MarkdownItRenderer.parse) ⇒ <code>Array.&lt;module:markdown-it/lib/token&gt;</code>
    * [.cleanContent(content)](#MarkdownItRenderer.cleanContent) ⇒ <code>string</code>
    * [.viewModelDetail(viewModel, context)](#MarkdownItRenderer.viewModelDetail) ⇒ <code>object</code>

<a name="MarkdownItRenderer.configKey"></a>

### MarkdownItRenderer.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The configuration key.  
**Example** *(MarkdownItRenderer.configKey)*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.defaultConfig"></a>

### MarkdownItRenderer.defaultConfig() ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
The default configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) - The default configuration.  
**Example** *(MarkdownItRenderer.defaultConfig())*  
```js
const config = { ...MarkdownItRenderer.defaultConfig(), ...context.config[MarkdownItRenderer.configKey] };
```
<a name="MarkdownItRenderer.extendConfig"></a>

### MarkdownItRenderer.extendConfig(config) ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
Create a config that is extended from the default config.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) - The new configration.  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | The user provided configuration. |

<a name="MarkdownItRenderer.validateConfig"></a>

### MarkdownItRenderer.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Record.&lt;string, MarkdownItRendererOptions&gt;</code> | A provided configuration to use. |
| _context | <code>object</code> | Unused |

**Example** *(MarkdownItRenderer.validateConfig(config, _context))*  
```js
MarkdownItRenderer.validateConfig({ ... });
```
<a name="MarkdownItRenderer.register"></a>

### MarkdownItRenderer.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided configuration to use. |

**Example** *(MarkdownItRenderer.register(context))*  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
      events: {
        renderContent: ['render-content', 'render-meta-description'],
        renderCollection: ['render-search-results'],
        validateConfig: ['validate-config'],
      },
    },
  },
};
MarkdownItRenderer.register(context);
```
<a name="MarkdownItRenderer.renderContent"></a>

### MarkdownItRenderer.renderContent(content, context) ⇒ <code>string</code>
Renders Markdown for a provided string with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided configuration to use. |

**Example** *(MarkdownItRenderer.renderContent(content, context))*  
```js
const context = {
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
    },
  },
};
MarkdownItRenderer.renderContent(content, context);
```
<a name="MarkdownItRenderer.renderCollection"></a>

### MarkdownItRenderer.renderCollection(collection, context) ⇒ <code>Array.&lt;object&gt;</code>
Renders Markdown for a collection of Uttori documents with a provided context.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>Array.&lt;object&gt;</code> - } The rendered documents.  

| Param | Type | Description |
| --- | --- | --- |
| collection | <code>Array.&lt;object&gt;</code> | A collection of Uttori documents. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided MarkdownIt configuration to use. |

**Example** *(MarkdownItRenderer.renderCollection(collection, context))*  
```js
const context = {
  config: {
    [MarkdownItRenderer.configKey]: {
      ...,
    },
  },
};
MarkdownItRenderer.renderCollection(collection, context);
```
<a name="MarkdownItRenderer.render"></a>

### MarkdownItRenderer.render(content, [config]) ⇒ <code>string</code>
Renders Markdown for a provided string with a provided MarkdownIt configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| [config] | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided MarkdownIt configuration to use. |

**Example** *(MarkdownItRenderer.render(content, config))*  
```js
const html = MarkdownItRenderer.render(content, config);
```
<a name="MarkdownItRenderer.parse"></a>

### MarkdownItRenderer.parse(content, [config]) ⇒ <code>Array.&lt;module:markdown-it/lib/token&gt;</code>
Parse Markdown for a provided string with a provided MarkdownIt configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>Array.&lt;module:markdown-it/lib/token&gt;</code> - The rendered content.  
**See**: [MarkdownIt.parse](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| [config] | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided MarkdownIt configuration to use. |

**Example** *(MarkdownItRenderer.parse(content, config))*  
```js
const tokens = MarkdownItRenderer.parse(content, config);
```
<a name="MarkdownItRenderer.cleanContent"></a>

### MarkdownItRenderer.cleanContent(content) ⇒ <code>string</code>
Removes empty links, as these have caused issues.
Find missing links, and link them to the slug from the provided text.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |

<a name="MarkdownItRenderer.viewModelDetail"></a>

### MarkdownItRenderer.viewModelDetail(viewModel, context) ⇒ <code>object</code>
Will attempt to extract the table of contents when set to and add it to the view model.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>object</code> - The view model.  

| Param | Type | Description |
| --- | --- | --- |
| viewModel | <code>object</code> | Markdown content to be converted to HTML. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A provided configuration to use. |

**Example** *(MarkdownItRenderer.viewModelDetail(viewModel, context))*  
```js
viewModel = MarkdownItRenderer.viewModelDetail(viewModel, context);
```
<a name="MarkdownItRendererOptions"></a>

## MarkdownItRendererOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| baseUrl | <code>string</code> | Prefix for relative URLs, useful when the Express app is not at URI root. |
| allowedExternalDomains | <code>Array.&lt;string&gt;</code> | Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org). |
| disableValidation | <code>boolean</code> | Optionally disable the built in Markdown-It link validation, large security risks when link validation is disabled. |
| openNewWindow | <code>boolean</code> | Open external domains in a new window. |
| lazyImages | <code>boolean</code> | Add lazy loading params to image tags. |
| footnotes | <code>object</code> | Footnote settings. |
| footnotes.referenceTag | <code>function</code> | A funciton to return the default HTML for a footnote reference. |
| footnotes.definitionOpenTag | <code>function</code> | A funciton to return the default opening HTML for a footnote definition. |
| footnotes.definitionCloseTag | <code>string</code> | The default closing HTML for a footnote definition. |
| toc | <code>object</code> | Table of Contents settings. |
| toc.extract | <code>boolean</code> | When true, extract the table of contents to the view model from the content. |
| toc.openingTag | <code>string</code> | The opening DOM tag for the TOC container. |
| toc.closingTag | <code>string</code> | The closing DOM tag for the TOC container. |
| toc.slugify | <code>object</code> | Slugify options for convering headings to anchor links. |
| wikilinks | <code>object</code> | WikiLinks settings. |
| wikilinks.slugify | <code>object</code> | Slugify options for convering Wikilinks to anchor links. |


* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)
