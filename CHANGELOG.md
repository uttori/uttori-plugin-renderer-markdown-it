# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [5.1.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v5.0.0...v5.1.0) - 2023-12-29

- 🧰 Add `disableValidation` option to disable validation of data-uri links and images.
- 🎁 Update dev dependencies
- 🛠 Fix some type issues

## [5.0.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.9.0...v5.0.0) - 2023-12-19

- 💥 BREAKING CHANGES!
- 🎁 Convert to be a module, and require Node v20
- 🎁 Update dependencies
- 🎁 Update dev dependencies
- 🛠 Update ESLint configuration
- 🛠 Update NVM to v20.10.0
- 🛠 Update old tooling configuration files
- 🛠 Remove CJS support, restructure to export ESM only
- 🛠 Fix `parentType` in the footnote component
- 🛠 Fix some unnecessary spread operations
- 🛠 Fix some extreme edge cases where tokens could be undefined or missing `map` & `attrs` arrays

## [4.9.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.8.0...v4.9.0) - 2023-04-23

- 🧰 Add `MarkdownItRenderer.parse(content, config)` for parsing Markdown to tokens.
- 🛠 Clean up some logic using optional chaining for conditional checks.
- 🎁 Update dev dependencies

## [4.8.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.7.0...v4.8.0) - 2023-04-01

- 🧰 Support for adding videos with `<video src="/uploads/example.mp4">`
- 🛠 Switch to `c8` from `nyc` and clean up unused ignore comments
- Update `slugify` to [v1.6.6](https://github.com/simov/slugify/blob/master/CHANGELOG.md)
- 🎁 Update dev dependencies

## [4.7.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.6.0...v4.7.0) - 2023-01-03

- 🧰 Support for adding color to spans with `[Text](color:#ffadad)`
- 🎁 Update dev dependencies

## [4.6.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.5.0...v4.6.0) - 2022-11-06

- 🧰 Support for extracting table of contents from `document.html` as a stand alone string
- 🛠 Fix some type issues
- 🎁 Update dev dependencies

## [4.5.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.4.0...v4.5.0) - 2022-06-29

- 🧰 Support for `<br /> or <br/> or <br>` tags in markup to allow line breaks anywhere, useful in tables
- 🎁 Update dev dependencies

## [4.4.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.3.2...v4.4.0) - 2022-05-29

- 🎁 Update `markdown-it` to v13.0.1
- 🎁 Update `slugify` to v1.6.5
- 🛠 Correctly remove code for broken YouTube links
- 🎁 Update dev dependencies

## [4.3.2](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.3.1...v4.3.2) - 2021-12-27

- Update dependencies

## [4.3.1](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.3.0...v4.3.1) - 2021-11-26

- 🛠 Fix Node v14 by removing ||= syntax

## [4.3.0](https://github.com/uttori/uttori-plugin-renderer-markdown-it/compare/v4.2.1...v4.3.0) - 2021-11-26

- 🧰 Support for `[^1] ... [^1]: Footnote` Footnotes based on [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
- 🛠 Fix Table of Contents HTML generation to be valid HTML (`UL` in `LI`)
- 🛠 Refactor files to be more function specific
- 🎁 Update dev dependencies

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
