# rehype-mathjax

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to render `<span class=math-inline>` and
`<div class=math-display>` with [MathJax][].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeMathjaxSvg[, options])`](#unifieduserehypemathjaxsvg-options)
*   [CSS](#css)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to render math.
You can combine it with [`remark-math`][remark-math] for math in markdown or add
`math-inline` and `math-display` classes in HTML.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that transforms hast.

## When should I use this?

This project is useful as it renders math with MathJax at compile time, which
means that there is no client side JavaScript needed.

A different plugin, [`rehype-katex`][rehype-katex], is similar but uses
[KaTeX][] instead.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-mathjax
```

In Deno with [Skypack][]:

```js
import rehypeMathjax from 'https://cdn.skypack.dev/rehype-mathjax@4?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import rehypeMathjax from 'https://cdn.skypack.dev/rehype-mathjax@4?min'
</script>
```

## Use

Say we have the following file `example.html`:

```html
<p>
  Lift(<span class="math math-inline">L</span>) can be determined by Lift Coefficient
  (<span class="math math-inline">C_L</span>) like the following equation.
</p>

<div class="math math-display">
  L = \frac{1}{2} \rho v^2 S C_L
</div>
```

And our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeMathjax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(rehypeParse, {fragment: true})
    .use(rehypeMathjax)
    .use(rehypeStringify)
    .process(await read('example.html'))

  console.log(String(file))
}
```

Now running `node example.js` yields:

```html
<p>
  Lift(<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><!--…--></mjx-container></span>) can be determined by Lift Coefficient
  (<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><!--…--></mjx-container></span>) like the following equation.
</p>

<div class="math math-display"><mjx-container class="MathJax" jax="SVG" display="true"><!--…--></mjx-container></div>
<style>
mjx-container[jax="SVG"] {
  direction: ltr;
}
/* … */
</style>
```

## API

This package exports no identifiers.
The default export is `rehypeMathjaxSvg`.

### `unified().use(rehypeMathjaxSvg[, options])`

Transform `<span class="math-inline">` and `<div class="math-display">` with
[MathJax][].

This package includes three plugins, split out because MathJax targets have a
big memory and bundle size footprint: SVG, CHTML, and browser:

###### SVG

Render math as [SVG][mathjax-svg]
(`import rehypeMathjaxSvg from 'rehype-mathjax/svg.js'`, default).
About 566kb minzipped.

###### CHTML

Render math as [CHTML][mathjax-chtml]
(`import rehypeMathjaxChtml from 'rehype-mathjax/chtml.js'`).
About 154kb minzipped.
Needs a `fontURL` to be passed.

###### Browser

Tiny wrapper that expects MathJax to do work client side
(`import rehypeMathjaxBrowser from 'rehype-mathjax/browser.js'`).
About 1kb minzipped.

Uses `options.displayMath` (default: `['\\[', '\\]']`) for display math and
`options.inlineMath` (default: `['\\(', '\\)']`) for inline math.

You need to load MathJax on the client yourself and start it with corresponding
markers.
Options are not passed to MathJax: do that yourself on the client.

#### `options`

All options, except when using the browser plugin, are passed to
[MathJax][mathjax-options].

#### `options.tex`

These options are passed to the [TeX input processor][mathjax-tex-options].
The browser plugin uses the first delimiter pair in `tex.displayMath` and
`tex.inlineMath` to instead wrap math.

#### `options.chtml`

These options are passed to the [CommonHTML output
processor][mathjax-chtml-options].
Passing `fontURL` is required!
For example:

```js
  // …
  .use(rehypeMathjaxChtml, {
    chtml: {
      fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/components/output/chtml/fonts/woff-v2'
    }
  })
  // …
```

#### `options.svg`

These options are passed to the [SVG output processor][mathjax-svg-options].

## CSS

The HTML produced by MathJax does not require any extra CSS to render correctly.

## Syntax tree

This plugin transforms elements with a class name of either `math-inline` and/or
`math-display`.

## Types

This package is fully typed with [TypeScript][].
An extra `Options` type is exported, which models the accepted options.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with unified version 6+ and rehype version 4+.

## Security

Using `rehype-mathjax` should be safe assuming that you trust MathJax.
Any vulnerability in it could open you to a [cross-site scripting (XSS)][xss]
attack.
Always be wary of user input and use [`rehype-sanitize`][rehype-sanitize].

When you don’t trust user content but do trust MathKax, you can allow the
classes added by `remark-math` while disallowing anything else in the
`rehype-sanitize` schema, and run `rehype-katex` afterwards.
Like so:

```js
import rehypeSanitize, {defaultSchema} from 'rehype-stringify'

const mathSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...defaultSchema.attributes.div,
      ['className', 'math', 'math-display']
    ],
    span: [
      ['className', 'math', 'math-inline']
    ]
  }
}

// …

unified()
  // …
  .use(rehypeSanitize, mathSanitizeSchema)
  .use(rehypeMathjax)
  // …
```

## Related

*   [`rehype-katex`][rehype-katex]
    — same but with KaTeX
*   [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight)
    — highlight code blocks
*   [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings)
    — add links to headings
*   [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize)
    — sanitize HTML
*   [`rehype-document`](https://github.com/rehypejs/rehype-document)
    — wrap a document around the tree

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

[build-badge]: https://github.com/remarkjs/remark-math/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-math/actions

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

[skypack]: https://www.skypack.dev

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-math/blob/main/license

[author]: https://rokt33r.github.io

[rehype]: https://github.com/rehypejs/rehype

[unified]: https://github.com/unifiedjs/unified

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[typescript]: https://www.typescriptlang.org

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mathjax]: https://mathjax.org/

[mathjax-options]: http://docs.mathjax.org/en/latest/options/

[mathjax-svg]: http://docs.mathjax.org/en/latest/output/svg.html

[mathjax-chtml]: http://docs.mathjax.org/en/latest/output/html.html

[mathjax-tex-options]: http://docs.mathjax.org/en/latest/options/input/tex.html

[mathjax-svg-options]: http://docs.mathjax.org/en/latest/options/output/svg.html

[mathjax-chtml-options]: http://docs.mathjax.org/en/latest/options/output/chtml.html

[katex]: https://github.com/Khan/KaTeX

[remark-math]: ../remark-math

[rehype-katex]: ../rehype-katex
