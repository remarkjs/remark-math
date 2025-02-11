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

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Examples](#examples)
  * [Example: KaTeX](#example-katex)
  * [Example: MathJax](#example-mathjax)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This repository contains [unified][] ([rehype][] and [remark][]) plugins to add
support for math.
You can use them to add support for parsing and serializing a syntax extension
and to render math with KaTeX or MathJax.

* [`remark-math`][remark-math]
  — remark plugin to support a math syntax in markdown
* [`rehype-katex`][rehype-katex]
  — rehype plugin to render math in HTML with [KaTeX][]
* [`rehype-mathjax`][rehype-mathjax]
  — rehype plugin to render math in HTML with [MathJax][]

When dealing with markdown, you optionally use `remark-math`, or alternatively
use fenced code (` ```math `).
Then, you either use `rehype-katex` or `rehype-mathjax` to render math in HTML.

## When should I use this?

This project is useful when you want to support LaTeX math.
This mechanism works well when you want authors, that have some LaTeX
experience, to be able to embed rich diagrams of math to scientific
documentation.
The extra syntax extension supported by `remark-math` for math in markdown does
not work everywhere so it makes markdown less portable.
This project is also useful as it renders math with KaTeX or MathJax at compile
time, which means that there is no client side JavaScript needed.

## Examples

### Example: KaTeX

Say our document `example.md` contains:

```markdown
Lift($$L$$) can be determined by Lift Coefficient ($$C_L$$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$
```

…and our module `example.js` contains:

```js
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {read} from 'to-vfile'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify)
  .process(await read('example.md'))

console.log(String(file))
```

…then running `node example.js` yields:

```html
<p>Lift(<code class="language-math math-inline"><span class="katex">…</span></code>) like the following
equation.</p>
<pre><code class="language-math math-display"><span class="katex-display"><span class="katex">…</span></span></code></pre>
```

> 👉 **Note**: KaTeX requires CSS to render correctly.
> Use `katex.css` somewhere on the page where the math is shown to style it
> properly:
>
> ```html
> <!-- Get the latest one from: https://katex.org/docs/browser -->
> <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet">
> ```

### Example: MathJax

Supporting either MathJax or KaTeX is very similar.
Take the above KaTeX example and change:

```diff
@@ -1,4 +1,4 @@
-import rehypeKatex from 'rehype-katex'
+import rehypeMathjax from 'rehype-mathjax'
 import rehypeStringify from 'rehype-stringify'
 import remarkMath from 'remark-math'
 import remarkParse from 'remark-parse'
@@ -10,7 +10,7 @@ const file = await unified()
   .use(remarkParse)
   .use(remarkMath)
   .use(remarkRehype)
-  .use(rehypeKatex)
+  .use(rehypeMathjax)
   .use(rehypeStringify)
   .process(await read('example.md'))
```

…then running `node example.js` yields:

```html
<p>Lift(<mjx-container class="MathJax" jax="SVG"><!--…--></mjx-container>) can be determined by Lift Coefficient (<mjx-container class="MathJax" jax="SVG"><!--…--></mjx-container>) like the following
equation.</p>
<mjx-container class="MathJax" jax="SVG" display="true"><!--…--></mjx-container><style>
mjx-container[jax="SVG"] {
  direction: ltr;
}
/* … */
</style>
```

## Security

Assuming you trust KaTeX/MathJax, using `rehype-katex`/`rehype-mathjax` is
safe.
If a vulnerability is introduced in them, it opens you up to a
[cross-site scripting (XSS)][wiki-xss] attack.
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

[author]: https://rokt33r.github.io

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[build]: https://github.com/remarkjs/remark-math/actions

[build-badge]: https://github.com/remarkjs/remark-math/workflows/main/badge.svg

[chat]: https://github.com/remarkjs/remark/discussions

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[collective]: https://opencollective.com/unified

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[coverage]: https://codecov.io/github/remarkjs/remark-math

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-math.svg

[downloads]: https://www.npmjs.com/package/remark-math

[downloads-badge]: https://img.shields.io/npm/dm/remark-math.svg

[health]: https://github.com/remarkjs/.github

[katex]: https://github.com/Khan/KaTeX

[license]: license

[mathjax]: https://mathjax.org/

[rehype]: https://github.com/rehypejs/rehype

[rehype-katex]: ./packages/rehype-katex/

[rehype-mathjax]: ./packages/rehype-mathjax/

[remark]: https://github.com/remarkjs/remark

[remark-math]: ./packages/remark-math/

[size]: https://bundlejs.com/?q=remark-math

[size-badge]: https://img.shields.io/bundlejs/size/remark-math

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[unified]: https://github.com/unifiedjs/unified

[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
