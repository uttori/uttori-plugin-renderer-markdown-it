## Classes

<dl>
<dt><a href="#MarkdownItRenderer">MarkdownItRenderer</a></dt>
<dd><p>Uttori MarkdownIt Renderer</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#debug">debug()</a> : <code>function</code></dt>
<dd></dd>
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
    * [.extendConfig([config])](#MarkdownItRenderer.extendConfig) ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
    * [.validateConfig(config, _context)](#MarkdownItRenderer.validateConfig)
    * [.register(context)](#MarkdownItRenderer.register)
    * [.renderContent(content, context)](#MarkdownItRenderer.renderContent) ⇒ <code>string</code>
    * [.renderCollection(collection, context)](#MarkdownItRenderer.renderCollection) ⇒ <code>Array.&lt;object&gt;</code>
    * [.render(content, config)](#MarkdownItRenderer.render) ⇒ <code>string</code>

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

### MarkdownItRenderer.extendConfig([config]) ⇒ [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions)
Create a config that is extended from the default config.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) - The new configration.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | <code>{}</code> | The user provided configuration. |

<a name="MarkdownItRenderer.validateConfig"></a>

### MarkdownItRenderer.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | [<code>MarkdownItRendererOptions</code>](#MarkdownItRendererOptions) | A configuration object specifically for this plugin. |
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
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

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
| context.config | <code>object</code> | A provided configuration to use. |

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
| context.config | <code>object</code> | A provided configuration to use. |

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

### MarkdownItRenderer.render(content, config) ⇒ <code>string</code>
Renders Markdown for a provided string with a provided MarkdownIt configuration.

**Kind**: static method of [<code>MarkdownItRenderer</code>](#MarkdownItRenderer)  
**Returns**: <code>string</code> - The rendered content.  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | Markdown content to be converted to HTML. |
| config | <code>object</code> | A provided MarkdownIt configuration to use. |

**Example** *(MarkdownItRenderer.render(content, config))*  
```js
const html = MarkdownItRenderer.render(content, config);
```
<a name="debug"></a>

## debug() : <code>function</code>
**Kind**: global function  
<a name="MarkdownItRendererOptions"></a>

## MarkdownItRendererOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [html] | <code>boolean</code> | <code>false</code> | Enable HTML tags in source. |
| [xhtmlOut] | <code>boolean</code> | <code>false</code> | Use '/' to close single tags (<br />). |
| [breaks] | <code>boolean</code> | <code>false</code> | Convert '\n' in paragraphs into <br>, this is only for full CommonMark compatibility. |
| [langPrefix] | <code>string</code> | <code>&quot;&#x27;language-&#x27;&quot;</code> | CSS language prefix for fenced blocks. Can be useful for external highlighters. |
| [linkify] | <code>boolean</code> | <code>false</code> | Autoconvert URL-like text to links. |
| [typographer] | <code>boolean</code> | <code>false</code> | Enable some language-neutral replacement + quotes beautification. |
| [quotes] | <code>string</code> | <code>&quot;&#x27;“”‘’&#x27;&quot;</code> | Double + single quotes replacement pairs, when typographer enabled, and smartquotes on. Could be either a String or an Array. For example, you can use '«»„“' for Russian, '„“‚‘' for German, and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp). |
| [highlight] | <code>function</code> |  | Highlighter function. Should return escaped HTML, or '' if the source string is not changed and should be escaped externally. If result starts with <pre... internal wrapper is skipped. |
| [uttori] | <code>object</code> | <code>{}</code> | Custom values for Uttori specific use. |
| [uttori.baseUrl] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Prefix for relative URLs, useful when the Express app is not at URI root. |
| [uttori.allowedExternalDomains] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Allowed External Domains, if a domain is not in this list, it is set to 'nofollow'. Values should be strings of the hostname portion of the URL object (like example.org). |
| [uttori.openNewWindow] | <code>boolean</code> | <code>true</code> | Open external domains in a new window. |
| [uttori.lazyImages] | <code>boolean</code> | <code>true</code> | Add lazy loading params to image tags. |
| [uttori.toc] | <code>object</code> | <code>{}</code> | Table of Contents settings. |
| [uttori.toc.openingTag] | <code>string</code> | <code>&quot;&#x27;&lt;nav class&amp;#61;\&quot;table-of-contents\&quot;&gt;&#x27;&quot;</code> | The opening DOM tag for the TOC container. |
| [uttori.toc.closingTag] | <code>string</code> | <code>&quot;&#x27;&lt;/nav&gt;&#x27;&quot;</code> | The closing DOM tag for the TOC container. |
| [uttori.toc.slugify] | <code>object</code> | <code>{ lower: true }</code> | Slugify options for convering headings to anchor links. |
| [uttori.wikilinks] | <code>object</code> | <code>{}</code> | WikiLinks settings. |
| [uttori.wikilinks.slugify] | <code>object</code> | <code>{ lower: true }</code> | Slugify options for convering Wikilinks to anchor links. |

