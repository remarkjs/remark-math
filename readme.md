# Remark Math

[![npm](https://img.shields.io/npm/v/remark-math.svg)](https://www.npmjs.com/package/remark-math)
[![Build Status](https://travis-ci.org/Rokt33r/remark-math.svg?branch=master)](https://travis-ci.org/Rokt33r/remark-math)
[![Chat](https://img.shields.io/gitter/room/wooorm/remark.svg)](https://gitter.im/wooorm/remark)

Math Inline and Block supporting for Remark

## What does Remark Math?

`remark-math` parses `$` for `inlineMath` node and `$$` for `math` node.

Also, you can transform the tex content of `inlineMath` and `math` nodes into html by `rehype-katex` or `remark-html-katex`.

![intro](resources/intro.png)

## Usages

There are two examples for server-side([`examples/nodejs`](examples/nodejs)) and browser-side([`examples/webpack`](examples/webpack), via webpack).

> You can run the demo by `npm run demo:nodejs` and `npm run demo:webpack`.

### Basic usages(Using `rehype-katex`, a little verbose but recommended)

Install dependencies

```sh
npm i -S remark remark-math remark-rehype rehype-katex rehype-stringify
```

```js
const remark = require('remark')
const math = require('remark-math')
const remark2rehype = require('remark-rehype')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')

// Raw String => MDAST => HAST => transformed HAST => HTML
const processor = remark()
  .use(math)
  .use(remark2rehype)
  .use(katex)
  .use(stringify)

// https://en.wikipedia.org/wiki/Lift_(force)#Lift_coefficient
const rawString = `Lift($L$) can be determined by Lift Coeeficient ($C_L$) like the following equation.

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
`

const result = processor.processSync(rawString).toString()
/* result
<p>
  Lift(<span class="inlineMath"><span class="katex">...</span></span>) can be determined by Lift Coeeficient (<span class="inlineMath"><span class="katex">...</span></span>) like the following equation.
</p>
<div class="math">
  <span class="katex-display"><span class="katex">...</span></span>
</div>
*/
```

### Another usages(Using `remark-html-katex`)

```sh
npm i -S remark remark-math remark-html-katex remark-html
```

```js
const remark = require('remark')
const math = require('remark-math')
const katex = require('remark-html-katex') // Use remark-html-katex
const html = require('remark-html')

// Raw String => MDAST => transformed MDAST => HTML
const processor = remark()
  .use(math)
  .use(katex)
  .use(html)
```

### Using only math inline(or math block)

You can access separated processors by `remark-math/inline` and `remark-math/block`

```js
const remark = require('remark')
const remark2rehype = require('remark-rehype')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')

const mathInline = require('remark-math/inline')
// const mathBlock = require('remark-math/block')

// Parse only inline
const processor = remark()
  .use(mathInline)
  .use(remark2rehype)
  .use(katex)
  .use(stringify)
```

## API

### `remark-math`

`remark-math` does not handle any option.

### `rehype-katex` and `remark-html-katex`

```js
const katex = require('rehype-katex')

const processor = remark()
  .use(math)
  .use(remark2rehype)
  .use(katex, {
    throwOnError: false,
    errorColor: '#FF0000',
    inlineDoubleDisplay: false
  })
  .use(stringify)

```

#### `options.throwOnError`

Throw if a KaTeX parse error occurs. (default: `false`)

#### `options.errorColor`

As long as `options.throwOnError` is not `true`, ParseError  message will be colored by `options.errorColor`. (default: #cc0000)

> [Options - Katex](https://katex.org/docs/options.html)

#### `options.macros`

A collection of custom macro.

> [Options - Katex](https://katex.org/docs/options.html)

#### `options.strict`

`boolean` or `string` or `function` (default: `"warn"`). If `false` or `"ignore`", allow features that make writing LaTeX convenient but are not actually supported by (Xe)LaTeX (similar to MathJax). If `true` or `"error"` (LaTeX faithfulness mode), throw an error for any such transgressions. If `"warn"` (the default), warn about such behavior via `console.warn`. Provide a custom function `handler(errorCode, errorMsg, token)` to customize behavior depending on the type of transgression (summarized by the string code `errorCode` and detailed in `errorMsg`); this function can also return `"ignore"`, `"error"`, or `"warn"` to use a built-in behavior.

> [Options - Katex](https://katex.org/docs/options.html)

### `inlineMathDouble` (*EXPERIMENTAL: Use with caution*)

#### `options.inlineMathDouble` of `remark-math` (*EXPERIMENTAL*)

Add `inlineMathDouble` class to inline `$$` math. It will have two classes, `inlineMath` and `inlineMathDouble` (default: `false`)

#### `options.inlineMathDoubleDisplay` of `rehype-katex` (*EXPERIMENTAL*)

If an element has `inlineMathDouble` class, set `displayMode` of KaTeX `true`. (default: `false`)

#### Usage

This option, together with a CSS rule like `.inlineMathDouble {display: block; text-align: center;}` allows authors to have equations inside paragraphs on a separate line:

```js
const unified = require('unified')
const parse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const rehypeKatex = require('rehype-katex')
const stringify = require('rehype-stringify')

const processor = unified()
  .use(parse)
  .use(math, {
    inlineMathDouble: true
  })
  .use(remark2rehype)
  .use(rehypeKatex, {
    inlineMathDoubleDisplay: true
  })
  .use(stringify)
```

![Example](https://cloud.githubusercontent.com/assets/2022803/24314687/26c96bb8-10e3-11e7-928e-f93cff49b456.png)

## Specs

### Escaped Dollars

Dollar signs can be escaped by back slash, `\`.

```
\$\alpha\$
```

![Escaped dollars](resources/escaped-dollars.png)

### Escaped dollars in math block/inline ([Super factorial](https://en.wikipedia.org/wiki/Factorial#Superfactorial))

```
$\alpha\$$

$$
\beta\$
$$
```

![Super factorials](resources/super-factorial.png)

### Double dollars in inline

Some TeX packages and Markdown processors use double dollars, `$$`, as a inline token. Remark Math will parse it also properly.

```
$$\alpha$$
```

![Double dollars as a inline token](resources/double-dollars.png)

## License

MIT © Junyoung Choi

[katex]: https://github.com/Khan/KaTeX
