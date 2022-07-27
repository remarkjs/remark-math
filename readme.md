# remark-math

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

This project is a monorepo that contains several packages for dealing with
math in markdown and HTML.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Examples](#examples)
    *   [Example: KaTeX](#example-katex)
    *   [Example: MathJax](#example-mathjax)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This repository contains [unified][] ([remark][] and [rehype][]) plugins to add
support for math.
You can use them to add support for parsing and serializing this syntax
extension and to render math with KaTeX or MathJax.

*   [`remark-math`][remark-math]
    — remark plugin to support a math syntax in markdown
*   [`rehype-katex`][rehype-katex]
    — rehype plugin to render math in HTML with [KaTeX][]
*   [`rehype-mathjax`][rehype-mathjax]
    — rehype plugin to render math in HTML with [MathJax][]

You typically use `remark-math` combined with either `rehype-katex` or
`rehype-mathjax`.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**remark** adds support for markdown and **rehype** adds support for HTML to
unified.

## When should I use this?

This project is useful when you want to support LaTeX math.
This mechanism works well when you want authors, that have some LaTeX
experience, to be able to embed rich diagrams of math to scientific
documentation.
The syntax of math in markdown does not work everywhere so it makes markdown
less portable.
This project is also useful as it renders math with KaTeX or MathJax at compile
time, which means that there is no client side JavaScript needed.

## Examples

### Example: KaTeX

Say we have the following file `example.md`:

```markdown
Lift($L$) can be determined by Lift Coefficient ($C_L$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$
```

And our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Now running `node example.js` yields:

```html
<p>Lift(<span class="math math-inline"><span class="katex">…</span></span>) can be determined by Lift Coefficient (<span class="math math-inline"><span class="katex">…</span></span>) like the following equation.</p>
<div class="math math-display"><span class="katex-display">…</span></div>
```

> 👉 **Note**: KaTeX requires CSS to render correctly.
> Use `katex.css` somewhere on the page where the math is shown to style it
> properly:
>
> ```html
> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">
> ```

<!--
  To update the above, go to <https://katex.org/docs/browser.html> and copy
  the URL and integrity.
-->

### Example: MathJax

Supporting either MathJax or KaTeX is very similar.
Take the above KaTeX example and change:

```diff
@@ -3,7 +3,7 @@ import {unified} from 'unified'
 import remarkParse from 'remark-parse'
 import remarkMath from 'remark-math'
 import remarkRehype from 'remark-rehype'
-import rehypeKatex from 'rehype-katex'
+import rehypeMathjax from 'rehype-mathjax'
 import rehypeStringify from 'rehype-stringify'

 main()
@@ -13,7 +13,7 @@ async function main() {
     .use(remarkParse)
     .use(remarkMath)
     .use(remarkRehype)
-    .use(rehypeKatex)
+    .use(rehypeMathjax)
     .use(rehypeStringify)
     .process(await read('example.md'))
```

Now running `node example.js` yields:

```html
<p>Lift(<span class="math math-inline"><mjx-container class="MathJax" jax="SVG">…</svg></mjx-container></span>) can be determined by Lift Coefficient (<span class="math math-inline"><mjx-container class="MathJax" jax="SVG">…</svg></mjx-container></span>) like the following
equation.</p>
<div class="math math-display"><mjx-container class="MathJax" jax="SVG" display="true">…</svg></mjx-container></div>
<style>mjx-container[jax="SVG"]{direction: ltr}/*…*/</style>
```

## Security

Using `rehype-katex` or `rehype-mathjax` should be safe assuming that you trust
KaTeX and MathJax.
Any vulnerability in them could open you to a [cross-site scripting (XSS)][xss]
attack.
See their readmes for more info.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Junyoung Choi][author] and TANIGUCHI Masaya

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-math/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-math/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-math.svg

[coverage]: https://codecov.io/github/remarkjs/remark-math

[downloads-badge]: https://img.shields.io/npm/dm/remark-math.svg

[downloads]: https://www.npmjs.com/package/remark-math

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-math.svg

[size]: https://bundlephobia.com/result?p=remark-math

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://rokt33r.github.io

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[katex]: https://github.com/Khan/KaTeX

[mathjax]: https://mathjax.org/

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[remark-math]: ./packages/remark-math

[rehype-katex]: ./packages/rehype-katex

[rehype-mathjax]: ./packages/rehype-mathjax
