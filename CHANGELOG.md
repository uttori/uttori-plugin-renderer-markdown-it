# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [4.2.1](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.2.0...v4.2.1) - 2021-10-10

- 🛠 Fix YouTube embeds sloppy code for replacing opening & closing P tags

## [4.2.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.1.0...v4.2.0) - 2021-10-10

- 🧰 Support for `<youtube v="">` to generate YouTube iframe embeds
- 🎁 Update dev dependencies

## [4.1.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.0.2...v4.1.0) - 2021-07-27

- 🧰 Support for `lazyImages` to add `loading="lazy"` [Lazy Loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) params on `<img>` tags
- 🎁 Update `markdown-it` to v12.1.0
- 🎁 Update dev dependencies

## [4.0.2](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.0.0...v4.0.2) - 2020-01-19

- 🛠 Fix Table of Contents on headers that contained other tags:

```md
## Header (`$00`)
```

- 🎁 Update dev dependencies

## [4.0.1](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.0.0...v4.0.1) - 2020-01-17

- 🛠 Fix WikiLinks on subdirectories
- 🎁 Update dev dependencies

## [4.0.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v3.2.3...v4.0.0) - 2020-01-16

- 🧰 Add ESM Support
- 🧰 Add explicit exports
- 🧰 Support for [WikiLinks](https://en.wikipedia.org/wiki/Help:Link#Wikilinks_(internal_links)) style linking
- 🧰 Support for generating a Table of Contents based on `H#` header tags with `[toc]`
- 🛠 Fix config extension with custom options
- 🎁 Update dev dependencies

## [3.2.5](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v3.2.3...v3.2.4) - 2020-01-02

- 🎁 Update dev dependencies

## [3.2.4](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v3.2.2...v3.2.3) - 2020-12-31

- 🎁 Update dev dependencies
- 🎁 Update `markdown-it` to v12.0.4
- 🧰 Remove `debug` as a dependency

## [3.2.3](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v3.2.2...v3.2.3) - 2020-11-15

- 🎁 Update dev dependencies
- 🎁 Update README badge URLs
- 🧰 Change how types are made and rebuild types
- 🧰 Created this file
