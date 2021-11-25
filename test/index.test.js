/* eslint-disable no-useless-escape */
const test = require('ava');
const MarkdownItRenderer = require('../src');

test('MarkdownItRenderer.register(context): can register', (t) => {
  t.notThrows(() => {
    MarkdownItRenderer.register({ hooks: { on: () => {} }, config: { [MarkdownItRenderer.configKey]: { events: { callback: [] } } } });
  });
});

test('MarkdownItRenderer.register(context): errors without event dispatcher', (t) => {
  t.throws(() => {
    MarkdownItRenderer.register({ hooks: {} });
  }, { message: 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.' });
});

test('MarkdownItRenderer.register(context): errors without events', (t) => {
  t.throws(() => {
    MarkdownItRenderer.register({ hooks: { on: () => {} }, config: { [MarkdownItRenderer.configKey]: {} } });
  }, { message: 'Missing events to listen to for in \'config.events\'.' });
});

test('Plugin.register(context): does not error with events corresponding to missing methods', (t) => {
  t.notThrows(() => {
    MarkdownItRenderer.register({
      hooks: {
        on: () => {},
      },
      config: {
        [MarkdownItRenderer.configKey]: {
          events: {
            test: ['test'],
            validateConfig: ['validate-config'],
          },
        },
      },
    });
  });
});

test('MarkdownItRenderer.defaultConfig(): can return a default config', (t) => {
  t.notThrows(MarkdownItRenderer.defaultConfig);
});

test('MarkdownItRenderer.extendConfig(config): can extend a config at all levels', (t) => {
  t.deepEqual(MarkdownItRenderer.extendConfig(), MarkdownItRenderer.defaultConfig());
  t.deepEqual(MarkdownItRenderer.extendConfig({ haystack: 'needle' }), {
    ...MarkdownItRenderer.defaultConfig(),
    haystack: 'needle',
  });
  t.deepEqual(MarkdownItRenderer.extendConfig({ uttori: { haystack: 'needle' } }), {
    ...MarkdownItRenderer.defaultConfig(),
    uttori: {
      haystack: 'needle',
      ...MarkdownItRenderer.defaultConfig().uttori,
    },
  });
  t.deepEqual(MarkdownItRenderer.extendConfig({ uttori: { toc: { haystack: 'needle' } } }), {
    ...MarkdownItRenderer.defaultConfig(),
    uttori: {
      ...MarkdownItRenderer.defaultConfig().uttori,
      toc: {
        ...MarkdownItRenderer.defaultConfig().uttori.toc,
        haystack: 'needle',
      },
    },
  });
  t.deepEqual(MarkdownItRenderer.extendConfig({ uttori: { wikilinks: { haystack: 'needle' } } }), {
    ...MarkdownItRenderer.defaultConfig(),
    uttori: {
      ...MarkdownItRenderer.defaultConfig().uttori,
      wikilinks: {
        ...MarkdownItRenderer.defaultConfig().uttori.wikilinks,
        haystack: 'needle',
      },
    },
  });
});

test('MarkdownItRenderer.validateConfig(config, _context): throws an error when config is missing', (t) => {
  t.throws(() => {
    MarkdownItRenderer.validateConfig();
  }, { message: 'MarkdownItRenderer Config Error: \'uttori-plugin-renderer-markdown-it\' configuration key is missing.' });
});

test('MarkdownItRenderer.validateConfig(config, _context): throws an error when uttori is missing', (t) => {
  t.throws(() => {
    MarkdownItRenderer.validateConfig({ [MarkdownItRenderer.configKey]: {} });
  }, { message: 'MarkdownItRenderer Config Error: \'uttori\' configuration key is missing.' });
});

test('MarkdownItRenderer.validateConfig(config, _context): throws an error when allowedExternalDomains is missing', (t) => {
  t.throws(() => {
    MarkdownItRenderer.validateConfig({ [MarkdownItRenderer.configKey]: { uttori: {} } });
  }, { message: 'MarkdownItRenderer Config Error: \'uttori.allowedExternalDomains\' is missing or not an array.' });
});

test('MarkdownItRenderer.validateConfig(config, _context): throws an error when allowedExternalDomains is not an array', (t) => {
  t.throws(() => {
    MarkdownItRenderer.validateConfig({ [MarkdownItRenderer.configKey]: { uttori: { allowedExternalDomains: {} } } });
  }, { message: 'MarkdownItRenderer Config Error: \'uttori.allowedExternalDomains\' is missing or not an array.' });
});

test('MarkdownItRenderer.validateConfig(config, _context): can validate a config', (t) => {
  t.notThrows(() => {
    MarkdownItRenderer.validateConfig({ [MarkdownItRenderer.configKey]: { uttori: { allowedExternalDomains: [] } } });
  });
});

test('MarkdownItRenderer.renderContent(content, context): throws error without a config', (t) => {
  t.throws(() => {
    MarkdownItRenderer.renderContent('![test](/test.png)');
  }, { message: 'Missing configuration.' });
});

test('MarkdownItRenderer.renderContent(content, context): can accept a config', (t) => {
  t.is(MarkdownItRenderer.renderContent('![test](/test.png)', { config: { [MarkdownItRenderer.configKey]: { xhtmlOut: true } } }), '<p><img src="/test.png" alt="test" loading="lazy" /></p>');
});

test('MarkdownItRenderer.renderCollection(collection, context): throws error without a config', (t) => {
  t.throws(() => {
    MarkdownItRenderer.renderCollection([{ html: '![test](/test.png)' }]);
  }, { message: 'Missing configuration.' });
});

test('MarkdownItRenderer.renderCollection(collection, context): can accept a config', (t) => {
  t.deepEqual(MarkdownItRenderer.renderCollection([{ html: '![test](/test.png)' }], { config: { [MarkdownItRenderer.configKey]: { xhtmlOut: true } } }), [{ html: '<p><img src="/test.png" alt="test" loading="lazy" /></p>' }]);
});

test('MarkdownItRenderer.render(content, config): handles empty values', (t) => {
  t.is(MarkdownItRenderer.render(''), '');
  t.is(MarkdownItRenderer.render(' '), '');
  t.is(MarkdownItRenderer.render(null), '');
  t.is(MarkdownItRenderer.render(Number.NaN), '');
  t.is(MarkdownItRenderer.render(undefined), '');
  t.is(MarkdownItRenderer.render(false), '');
  t.is(MarkdownItRenderer.render(), '');
});

test('MarkdownItRenderer.render(content, config): replaces missing links with a slugified link', (t) => {
  t.is(MarkdownItRenderer.render('[Test]'), '<p>[Test]</p>');
  t.is(MarkdownItRenderer.render('[Test]()'), '<p><a href="/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[CrAzY CaSe SpAcEd]()'), '<p><a href="/crazy-case-spaced">CrAzY CaSe SpAcEd</a></p>');
});

test('MarkdownItRenderer.render(content, config): prepends the baseURL when set', (t) => {
  t.is(MarkdownItRenderer.render('[Test]', { uttori: { baseUrl: '/wiki' } }), '<p>[Test]</p>');
  t.is(MarkdownItRenderer.render('[Test]()', { uttori: { baseUrl: '/wiki' } }), '<p><a href="/wiki/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[CrAzY CaSe SpAcEd]()', { uttori: { baseUrl: '/wiki' } }), '<p><a href="/wiki/crazy-case-spaced">CrAzY CaSe SpAcEd</a></p>');
});

test('MarkdownItRenderer.render(content, config): protects SEO by ignoring unknown domains', (t) => {
  t.is(MarkdownItRenderer.render('[Test]', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p>[Test]</p>');
  t.is(MarkdownItRenderer.render('[Test]()', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p><a href="/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](http://example.org/wiki/test)', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p><a href="http://example.org/wiki/test" rel="external noopener noreferrer">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](https://example.org/wiki/test)', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p><a href="https://example.org/wiki/test" rel="external noopener noreferrer">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](http://evil.org/wiki/test)', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p><a href="http://evil.org/wiki/test" rel="external nofollow noopener noreferrer">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](https://evil.org/wiki/test)', { uttori: { allowedExternalDomains: ['example.org'] } }), '<p><a href="https://evil.org/wiki/test" rel="external nofollow noopener noreferrer">Test</a></p>');
});

test('MarkdownItRenderer.render(content, config): can set external links to open in a new window', (t) => {
  t.is(MarkdownItRenderer.render('[Test]', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p>[Test]</p>');
  t.is(MarkdownItRenderer.render('[Test]()', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="/wiki/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="/wiki/test">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](http://example.org/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="http://example.org/wiki/test" rel="external noopener noreferrer" target="_blank">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](https://example.org/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="https://example.org/wiki/test" rel="external noopener noreferrer" target="_blank">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](http://evil.org/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="http://evil.org/wiki/test" rel="external nofollow noopener noreferrer" target="_blank">Test</a></p>');
  t.is(MarkdownItRenderer.render('[Test](https://evil.org/wiki/test)', { uttori: { openNewWindow: true, allowedExternalDomains: ['example.org'] } }), '<p><a href="https://evil.org/wiki/test" rel="external nofollow noopener noreferrer" target="_blank">Test</a></p>');
});

test('MarkdownItRenderer.render(content, config): can render a WikiLink', (t) => {
  const markdown = 'A deep [[Link]]';
  const output = '<p>A deep <a href="link">Link</a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render multiple WikiLinks', (t) => {
  const markdown = 'A deep [[Link]] and a deeper [[hole]] but maybe a [[lake|big lake]]';
  const output = '<p>A deep <a href="link">Link</a> and a deeper <a href="hole">hole</a> but maybe a <a href="lake">big lake</a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a WikiLink with custom anchor text', (t) => {
  const markdown = 'A deep [[LINK|hole]]';
  const output = '<p>A deep <a href="link">hole</a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a WikiLink with a bracket character in the text', (t) => {
  // eslint-disable-next-line no-useless-escape
  // eslint-disable-next-line quotes
  const markdown = `A deep [[LINK|\\[hole]]`;
  const output = '<p>A deep <a href="link">\\[hole</a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a WikiLink with a bad text part', (t) => {
  const markdown = 'A deep [[LINK|]]';
  const output = '<p>A deep <a href="link">LINK</a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): does not error with a WikiLink with another WikiLink starting before the first closed', (t) => {
  const markdown = 'A deep [[LINK[[]]';
  const output = '<p>A deep <a href=""></a>[[LINK<a href=""></a></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): does not error with a WikiLink with a line break in the text part', (t) => {
  const markdown = `A deep [[LINK|
]]`;
  const output = `<p>A deep [[LINK|
]]</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a WikiLink with a baseUrl', (t) => {
  const markdown = 'A deep [[Link]]';
  const output = '<p>A deep <a href="/wiki/link">Link</a></p>';
  t.is(MarkdownItRenderer.render(markdown, { ...MarkdownItRenderer.defaultConfig(), uttori: { ...MarkdownItRenderer.defaultConfig().uttori, baseUrl: '/wiki' } }), output);
});

test('MarkdownItRenderer.render(content, config): can render an Image with lazy loading', (t) => {
  const markdown = '![](example.png "image title")';
  const output = '<p><img src="example.png" alt="" title="image title" loading="lazy"></p>';
  t.is(MarkdownItRenderer.render(markdown, { ...MarkdownItRenderer.defaultConfig(), uttori: { ...MarkdownItRenderer.defaultConfig().uttori, lazyImages: true } }), output);
});

test('MarkdownItRenderer.render(content, config): can render an Image without lazy loading', (t) => {
  const markdown = '![](example.png "image title")';
  const output = '<p><img src="example.png" alt="" title="image title"></p>';
  t.is(MarkdownItRenderer.render(markdown, { ...MarkdownItRenderer.defaultConfig(), uttori: { ...MarkdownItRenderer.defaultConfig().uttori, lazyImages: false } }), output);
});
