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

test('MarkdownItRenderer.render(content, config): can render a table of contents', (t) => {
  const markdown = '# First\n## Second\n### Third\n### Third Again\n#### Fouth\n\n## Second Again\n### Third Last\nContent\nContent\n[toc]\nContent\nContent';
  const output = `<h1 id="first-0">First</h1>
<h2 id="second-1">Second</h2>
<h3 id="third-2">Third</h3>
<h3 id="third-again-3">Third Again</h3>
<h4 id="fouth-4">Fouth</h4>
<h2 id="second-again-6">Second Again</h2>
<h3 id="third-last-7">Third Last</h3>
<p>Content
Content
<nav class="table-of-contents"><ul class="table-of-contents-h1"><li><a href="#first-0" title="First">First</a></li><ul class="table-of-contents-h2"><li><a href="#second-1" title="Second">Second</a></li><ul class="table-of-contents-h3"><li><a href="#third-2" title="Third">Third</a></li><li><a href="#third-again-3" title="Third Again">Third Again</a></li><ul class="table-of-contents-h4"><li><a href="#fouth-4" title="Fouth">Fouth</a></li></ul></ul><li><a href="#second-again-6" title="Second Again">Second Again</a></li><ul class="table-of-contents-h3"><li><a href="#third-last-7" title="Third Last">Third Last</a></li></ul></ul></ul></nav>
Content
Content</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with no H1', (t) => {
  const markdown = '## First\n## Second\n### Third\n### Third Again\n#### Fouth\n\n## Second Again\n### Third Last\nContent\nContent\n[toc]';
  const output = `<h2 id="first-0">First</h2>
<h2 id="second-1">Second</h2>
<h3 id="third-2">Third</h3>
<h3 id="third-again-3">Third Again</h3>
<h4 id="fouth-4">Fouth</h4>
<h2 id="second-again-6">Second Again</h2>
<h3 id="third-last-7">Third Last</h3>
<p>Content
Content
<nav class="table-of-contents"><ul class="table-of-contents-h2"><li><a href="#first-0" title="First">First</a></li><li><a href="#second-1" title="Second">Second</a></li><ul class="table-of-contents-h3"><li><a href="#third-2" title="Third">Third</a></li><li><a href="#third-again-3" title="Third Again">Third Again</a></li><ul class="table-of-contents-h4"><li><a href="#fouth-4" title="Fouth">Fouth</a></li></ul><li><a href="#second-again-6" title="Second Again">Second Again</a></li><ul class="table-of-contents-h3"><li><a href="#third-last-7" title="Third Last">Third Last</a></li></ul></ul></ul></nav></p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with no H2', (t) => {
  const markdown = '### First\n### Second\n#### Third\n### Third Again\n#### Fouth\n\n### Second Again\n#### Third Last\nContent\nContent\n[toc]';
  const output = `<h3 id="first-0">First</h3>
<h3 id="second-1">Second</h3>
<h4 id="third-2">Third</h4>
<h3 id="third-again-3">Third Again</h3>
<h4 id="fouth-4">Fouth</h4>
<h3 id="second-again-6">Second Again</h3>
<h4 id="third-last-7">Third Last</h4>
<p>Content
Content
<nav class="table-of-contents"><ul class="table-of-contents-h3"><li><a href="#first-0" title="First">First</a></li><li><a href="#second-1" title="Second">Second</a></li><ul class="table-of-contents-h4"><li><a href="#third-2" title="Third">Third</a></li></ul><li><a href="#third-again-3" title="Third Again">Third Again</a></li><ul class="table-of-contents-h4"><li><a href="#fouth-4" title="Fouth">Fouth</a></li></ul><li><a href="#second-again-6" title="Second Again">Second Again</a></li><ul class="table-of-contents-h4"><li><a href="#third-last-7" title="Third Last">Third Last</a></li></ul></ul></nav></p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with empty headers', (t) => {
  const markdown = '# \n## \n### \n### \n#### \n\n## \n### \nContent\nContent\n[toc]\nContent\nContent';
  const output = `<h1></h1>
<h2></h2>
<h3></h3>
<h3></h3>
<h4></h4>
<h2></h2>
<h3></h3>
<p>Content
Content
<nav class="table-of-contents"><ul class="table-of-contents-h1"><li><a href="#-0" title=""></a></li><ul class="table-of-contents-h2"><li><a href="#-1" title=""></a></li><ul class="table-of-contents-h3"><li><a href="#-2" title=""></a></li><li><a href="#-3" title=""></a></li><ul class="table-of-contents-h4"><li><a href="#-4" title=""></a></li></ul></ul><li><a href="#-6" title=""></a></li><ul class="table-of-contents-h3"><li><a href="#-7" title=""></a></li></ul></ul></ul></nav>
Content
Content</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with ending tags', (t) => {
  const markdown = '# First #\n## Second ##\n### Third ###\n### Third Again ###\n#### Fouth ####\n\n## Second Again ##\n### Third Last ###\nContent\nContent\n[toc]\nContent\nContent';
  const output = `<h1 id="first-0">First</h1>
<h2 id="second-1">Second</h2>
<h3 id="third-2">Third</h3>
<h3 id="third-again-3">Third Again</h3>
<h4 id="fouth-4">Fouth</h4>
<h2 id="second-again-6">Second Again</h2>
<h3 id="third-last-7">Third Last</h3>
<p>Content
Content
<nav class="table-of-contents"><ul class="table-of-contents-h1"><li><a href="#first-0" title="First">First</a></li><ul class="table-of-contents-h2"><li><a href="#second-1" title="Second">Second</a></li><ul class="table-of-contents-h3"><li><a href="#third-2" title="Third">Third</a></li><li><a href="#third-again-3" title="Third Again">Third Again</a></li><ul class="table-of-contents-h4"><li><a href="#fouth-4" title="Fouth">Fouth</a></li></ul></ul><li><a href="#second-again-6" title="Second Again">Second Again</a></li><ul class="table-of-contents-h3"><li><a href="#third-last-7" title="Third Last">Third Last</a></li></ul></ul></ul></nav>
Content
Content</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with new lines', (t) => {
  const markdown = '# First\n## Second\n### Third\n### Third Again\n#### Fouth\n\n## Second Again\n### Third Last\nContent\nContent\n\n[toc]\nContent\nContent';
  const output = `<h1 id="first-0">First</h1>
<h2 id="second-1">Second</h2>
<h3 id="third-2">Third</h3>
<h3 id="third-again-3">Third Again</h3>
<h4 id="fouth-4">Fouth</h4>
<h2 id="second-again-6">Second Again</h2>
<h3 id="third-last-7">Third Last</h3>
<p>Content
Content</p>
<p><nav class="table-of-contents"><ul class="table-of-contents-h1"><li><a href="#first-0" title="First">First</a></li><ul class="table-of-contents-h2"><li><a href="#second-1" title="Second">Second</a></li><ul class="table-of-contents-h3"><li><a href="#third-2" title="Third">Third</a></li><li><a href="#third-again-3" title="Third Again">Third Again</a></li><ul class="table-of-contents-h4"><li><a href="#fouth-4" title="Fouth">Fouth</a></li></ul></ul><li><a href="#second-again-6" title="Second Again">Second Again</a></li><ul class="table-of-contents-h3"><li><a href="#third-last-7" title="Third Last">Third Last</a></li></ul></ul></ul></nav>
Content
Content</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with no headers', (t) => {
  const markdown = 'Content\nContent\n[toc]\nContent\nContent';
  const output = `<p>Content
Content
<nav class="table-of-contents"></nav>
Content
Content</p>`;
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
});

test('MarkdownItRenderer.render(content, config): can render a table of contents with code in headers', (t) => {
  const markdown = '## End / Return (`$00`)\n[toc]\n';
  const output = '<h2 id="end-return-(dollar00)-0">End / Return (<code>$00</code>)</h2>\n<p><nav class="table-of-contents"><ul class="table-of-contents-h2"><li><a href="#end-return-(dollar00)-0" title="End / Return (`$00`)">End / Return (`$00`)</a></li></ul></nav></p>';
  t.is(MarkdownItRenderer.render(markdown, MarkdownItRenderer.defaultConfig()), output);
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
