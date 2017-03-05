# Remark HTML Katex

KaTeX transformer plugin for remark-html.

It transfroms html content of `math` and `inlineMath` nodes with KaTeX.

> `math` and `inlineMath` nodes can be parsed with `remark-math`.

## Usage

```sh
npm i -S remark remark-math remark-html
npm i -S remark-html-katex
```

```js
const remark = require('remark')
const math = require('remark-math')
const katex = require('remark-html-katex')
const html = require('remark-html')

// Raw String => MDAST => transformed MDAST => HTML
const processor = remark()
  .use(math)
  .use(katex)
  .use(html)

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

Check [remark-math](https://github.com/rokt33r/remark-math) for more information.

## License

MIT © Junyoung Choi
