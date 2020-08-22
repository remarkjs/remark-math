# rehype-mathjax

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to transform `<span class=math-inline>` and
`<div class=math-display>` with [MathJax][].

## Install

[npm][]:

```sh
npm install rehype-mathjax
```

## Use

Say we have the following file, `example.html`:

```html
<p>
  Lift(<span class="math math-inline">L</span>) can be determined by Lift Coefficient
  (<span class="math math-inline">C_L</span>) like the following equation.
</p>

<div class="math math-display">
  L = \frac{1}{2} \rho v^2 S C_L
</div>
```

And our script, `example.js`, looks as follows:

```js
const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const mathjax = require('rehype-mathjax')
const stringify = require('rehype-stringify')

unified()
  .use(parse, {fragment: true})
  .use(mathjax)
  .use(stringify)
  .process(vfile.readSync('example.html'), function (err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<p>
  Lift(<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.541ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 681 683" xmlns:xlink="http://www.w3.org/1999/xlink">…</svg></mjx-container></span>) can be determined by Lift Coefficient
  (<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.339ex;" xmlns="http://www.w3.org/2000/svg" width="2.82ex" height="1.934ex" role="img" focusable="false" viewBox="0 -705 1246.5 855" xmlns:xlink="http://www.w3.org/1999/xlink">…</svg></mjx-container></span>) like the following equation.
</p>

<div class="math math-display"><mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -1.552ex;" xmlns="http://www.w3.org/2000/svg" width="14.144ex" height="4.588ex" role="img" focusable="false" viewBox="0 -1342 6251.6 2028" xmlns:xlink="http://www.w3.org/1999/xlink">…</svg></mjx-container></div>
<style>
mjx-container[jax="SVG"] {
  direction: ltr;
}

mjx-container[jax="SVG"] > svg {
  overflow: visible;
}

…
</style>
```

## API

### `rehype().use(rehypeMathJax[, options])`

Transform `<span class="math-inline">` and `<div class="math-display">` with
[MathJax][].

This package includes three plugins, split out because MathJax targets have a
big memory and size footprint: SVG, CHTML, and browser:

###### SVG

Render math as [SVG][mathjax-svg] (`require('rehype-mathjax/svg')`, default).
About 566kb minzipped.

###### CHTML

Render math as [CHTML][mathjax-chtml] (`require('rehype-mathjax/chtml')`).
About 154kb minzipped.
Needs a `fontURL` to be passed.

###### Browser

Tiny wrapper to render MathJax client-side (`require('rehype-mathjax/browser')`).
About 1kb minzipped.

Uses `options.displayMath` (default: `['\\[', '\\]']`) for display, and
`options.inlineMath` (default: `['\\(', '\\)']`) for inline math.

You need to load MathJax on the client yourself and start it with corresponding
markers.
Options are not passed to MathJax: do that yourself on the client.

#### `options`

All options, except when using the browser plugin, are passed to
[MathJax][mathjax-options].

## Security

Use of `rehype-mathjax` renders user content with [MathJax][], so any
vulnerability in MathJax can open you to a [cross-site scripting (XSS)][xss]
attack.

Always be wary of user input and use [`rehype-sanitize`][rehype-sanitize].

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [TANIGUCHI Masaya][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-math/main.svg

[build]: https://travis-ci.org/remarkjs/remark-math

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-math.svg

[coverage]: https://codecov.io/github/remarkjs/remark-math

[downloads-badge]: https://img.shields.io/npm/dm/rehype-mathjax.svg

[downloads]: https://www.npmjs.com/package/rehype-mathjax

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-mathjax.svg

[size]: https://bundlephobia.com/result?p=rehype-mathjax

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-math/blob/main/license

[author]: https://rokt33r.github.io

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mathjax]: https://mathjax.org/

[mathjax-options]: http://docs.mathjax.org/en/latest/options/

[mathjax-svg]: http://docs.mathjax.org/en/latest/output/svg.html

[mathjax-chtml]: http://docs.mathjax.org/en/latest/output/html.html
