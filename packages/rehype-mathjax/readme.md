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

### API

```js
unified().use(rehypeMathjax, output, options)
```

*   `ouput`: Which output format does plugin use, `'chtml'` or `'svg'`
*   `options`: MathJax ouput options for 
    [CommonHTML ouput processor](http://docs.mathjax.org/en/latest/options/output/chtml.html)
    and [SVG ouput processor](http://docs.mathjax.org/en/latest/options/output/svg.html)

### Example

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
unified()
  .use(parse, {fragment: true})
  .use(mathjax, 'chtml', {fontURL: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2/'})
  .use(stringify)
  .process(vfile.readSync('example.html'), function (err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<p>
  Lift(<span class="math math-inline"><mjx-container class="MathJax" jax="CHTML"><mjx-math class="MJX-TEX"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43F TEX-I"></mjx-c></mjx-mi></mjx-math></mjx-container></span>) can be determined by Lift Coefficient
  (<span class="math math-inline"><mjx-container class="MathJax" jax="CHTML"><mjx-math class="MJX-TEX"><mjx-msub><mjx-mi class="mjx-i" noic="true"><mjx-c class="mjx-c1D436 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-mi class="mjx-i" size="s"><mjx-c class="mjx-c1D43F TEX-I"></mjx-c></mjx-mi></mjx-script></mjx-msub></mjx-math></mjx-container></span>) like the following equation.
</p>

<div class="math math-display"><mjx-container class="MathJax" jax="CHTML" display="true"><mjx-math display="true" style="margin-left: 0px; margin-right: 0px;" class="MJX-TEX"><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43F TEX-I"></mjx-c></mjx-mi><mjx-mo class="mjx-n" space="4"><mjx-c class="mjx-c3D"></mjx-c></mjx-mo><mjx-mfrac space="4"><mjx-frac type="d"><mjx-num><mjx-nstrut type="d"></mjx-nstrut><mjx-mn class="mjx-n"><mjx-c class="mjx-c31"></mjx-c></mjx-mn></mjx-num><mjx-dbox><mjx-dtable><mjx-line type="d"></mjx-line><mjx-row><mjx-den><mjx-dstrut type="d"></mjx-dstrut><mjx-mn class="mjx-n"><mjx-c class="mjx-c32"></mjx-c></mjx-mn></mjx-den></mjx-row></mjx-dtable></mjx-dbox></mjx-frac></mjx-mfrac><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D70C TEX-I"></mjx-c></mjx-mi><mjx-msup><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D463 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: 0.413em;"><mjx-mn class="mjx-n" size="s"><mjx-c class="mjx-c32"></mjx-c></mjx-mn></mjx-script></mjx-msup><mjx-mi class="mjx-i"><mjx-c class="mjx-c1D446 TEX-I"></mjx-c></mjx-mi><mjx-msub><mjx-mi class="mjx-i" noic="true"><mjx-c class="mjx-c1D436 TEX-I"></mjx-c></mjx-mi><mjx-script style="vertical-align: -0.15em;"><mjx-mi class="mjx-i" size="s"><mjx-c class="mjx-c1D43F TEX-I"></mjx-c></mjx-mi></mjx-script></mjx-msub></mjx-math></mjx-container></div>

<style>
mjx-container[jax="CHTML"] {
  line-height: 0;
}

mjx-container [space="1"] {
  margin-left: .111em;
}

mjx-container [space="2"] {
  margin-left: .167em;
}

mjx-container [space="3"] {
  margin-left: .222em;
}

mjx-container [space="4"] {
  margin-left: .278em;
}

mjx-container [space="5"] {
  margin-left: .333em;
}

mjx-container [rspace="1"] {
  margin-right: .111em;
}

mjx-container [rspace="2"] {
  margin-right: .167em;
}

mjx-container [rspace="3"] {
  margin-right: .222em;
}

mjx-container [rspace="4"] {
  margin-right: .278em;
}

mjx-container [rspace="5"] {
  margin-right: .333em;
}

mjx-container [size="s"] {
  font-size: 70.7%;
}

mjx-container [size="ss"] {
  font-size: 50%;
}

mjx-container [size="Tn"] {
  font-size: 60%;
}

mjx-container [size="sm"] {
  font-size: 85%;
}

mjx-container [size="lg"] {
  font-size: 120%;
}

mjx-container [size="Lg"] {
  font-size: 144%;
}

mjx-container [size="LG"] {
  font-size: 173%;
}

mjx-container [size="hg"] {
  font-size: 207%;
}

mjx-container [size="HG"] {
  font-size: 249%;
}

mjx-container [width="full"] {
  width: 100%;
}

mjx-box {
  display: inline-block;
}

mjx-block {
  display: block;
}

mjx-itable {
  display: inline-table;
}

mjx-row {
  display: table-row;
}

mjx-row > * {
  display: table-cell;
}

mjx-mtext {
  display: inline-block;
}

mjx-mstyle {
  display: inline-block;
}

mjx-merror {
  display: inline-block;
  color: red;
  background-color: yellow;
}

mjx-mphantom {
  visibility: hidden;
}

mjx-math {
  display: inline-block;
  text-align: left;
  line-height: 0;
  text-indent: 0;
  font-style: normal;
  font-weight: normal;
  font-size: 100%;
  font-size-adjust: none;
  letter-spacing: normal;
  word-wrap: normal;
  word-spacing: normal;
  white-space: nowrap;
  direction: ltr;
  padding: 1px 0;
}

mjx-container[jax="CHTML"][display="true"] {
  display: block;
  text-align: center;
  margin: 1em 0;
}

mjx-container[jax="CHTML"][display="true"][width="full"] {
  display: flex;
}

mjx-container[jax="CHTML"][display="true"] mjx-math {
  padding: 0;
}

mjx-container[jax="CHTML"][justify="left"] {
  text-align: left;
}

mjx-container[jax="CHTML"][justify="right"] {
  text-align: right;
}

mjx-mi {
  display: inline-block;
  text-align: left;
}

mjx-mo {
  display: inline-block;
  text-align: left;
}

mjx-stretchy-h {
  display: inline-table;
  width: 100%;
}

mjx-stretchy-h > * {
  display: table-cell;
  width: 0;
}

mjx-stretchy-h > * > mjx-c {
  display: inline-block;
  transform: scalex(1.0000001);
}

mjx-stretchy-h > * > mjx-c::before {
  display: inline-block;
  padding: .001em 0;
  width: initial;
}

mjx-stretchy-h > mjx-ext {
  overflow: hidden;
  width: 100%;
}

mjx-stretchy-h > mjx-ext > mjx-c::before {
  transform: scalex(500);
}

mjx-stretchy-h > mjx-ext > mjx-c {
  width: 0;
}

mjx-stretchy-h > mjx-beg > mjx-c {
  margin-right: -.1em;
}

mjx-stretchy-h > mjx-end > mjx-c {
  margin-left: -.1em;
}

mjx-stretchy-v {
  display: inline-block;
}

mjx-stretchy-v > * {
  display: block;
}

mjx-stretchy-v > mjx-beg {
  height: 0;
}

mjx-stretchy-v > mjx-end > mjx-c {
  display: block;
}

mjx-stretchy-v > * > mjx-c {
  transform: scaley(1.0000001);
  transform-origin: left center;
  overflow: hidden;
}

mjx-stretchy-v > mjx-ext {
  display: block;
  height: 100%;
  box-sizing: border-box;
  border: 0px solid transparent;
  overflow: hidden;
}

mjx-stretchy-v > mjx-ext > mjx-c::before {
  width: initial;
}

mjx-stretchy-v > mjx-ext > mjx-c {
  transform: scaleY(500) translateY(.1em);
  overflow: visible;
}

mjx-mark {
  display: inline-block;
  height: 0px;
}

mjx-mn {
  display: inline-block;
  text-align: left;
}

mjx-mfrac {
  display: inline-block;
  text-align: left;
}

mjx-frac {
  display: inline-block;
  vertical-align: 0.17em;
  padding: 0 .22em;
}

mjx-frac[type="d"] {
  vertical-align: .04em;
}

mjx-frac[delims] {
  padding: 0 .1em;
}

mjx-frac[atop] {
  padding: 0 .12em;
}

mjx-frac[atop][delims] {
  padding: 0;
}

mjx-dtable {
  display: inline-table;
  width: 100%;
}

mjx-dtable > * {
  font-size: 2000%;
}

mjx-dbox {
  display: block;
  font-size: 5%;
}

mjx-num {
  display: block;
  text-align: center;
}

mjx-den {
  display: block;
  text-align: center;
}

mjx-mfrac[bevelled] > mjx-num {
  display: inline-block;
}

mjx-mfrac[bevelled] > mjx-den {
  display: inline-block;
}

mjx-den[align="right"], mjx-num[align="right"] {
  text-align: right;
}

mjx-den[align="left"], mjx-num[align="left"] {
  text-align: left;
}

mjx-nstrut {
  display: inline-block;
  height: .054em;
  width: 0;
  vertical-align: -.054em;
}

mjx-nstrut[type="d"] {
  height: .217em;
  vertical-align: -.217em;
}

mjx-dstrut {
  display: inline-block;
  height: .505em;
  width: 0;
}

mjx-dstrut[type="d"] {
  height: .726em;
}

mjx-line {
  display: block;
  box-sizing: border-box;
  min-height: 1px;
  height: .06em;
  border-top: .06em solid;
  margin: .06em -.1em;
  overflow: hidden;
}

mjx-line[type="d"] {
  margin: .18em -.1em;
}

mjx-msub {
  display: inline-block;
  text-align: left;
}

mjx-msup {
  display: inline-block;
  text-align: left;
}

mjx-munder {
  display: inline-block;
  text-align: left;
}

mjx-over {
  text-align: left;
}

mjx-munder:not([limits="false"]) {
  display: inline-table;
}

mjx-munder > mjx-row {
  text-align: left;
}

mjx-under {
  padding-bottom: .1em;
}

mjx-mover {
  display: inline-block;
  text-align: left;
}

mjx-mover:not([limits="false"]) {
  padding-top: .1em;
}

mjx-mover:not([limits="false"]) > * {
  display: block;
  text-align: left;
}

mjx-c {
  display: inline-block;
}

mjx-utext {
  display: inline-block;
  padding: .75em 0 .2em 0;
}

mjx-c::before {
  display: block;
  width: 0;
}

.MJX-TEX {
  font-family: MJXZERO, MJXTEX;
}

.TEX-B {
  font-family: MJXZERO, MJXTEX-B;
}

.TEX-I {
  font-family: MJXZERO, MJXTEX-I;
}

.TEX-MI {
  font-family: MJXZERO, MJXTEX-MI;
}

.TEX-BI {
  font-family: MJXZERO, MJXTEX-BI;
}

.TEX-S1 {
  font-family: MJXZERO, MJXTEX-S1;
}

.TEX-S2 {
  font-family: MJXZERO, MJXTEX-S2;
}

.TEX-S3 {
  font-family: MJXZERO, MJXTEX-S3;
}

.TEX-S4 {
  font-family: MJXZERO, MJXTEX-S4;
}

.TEX-A {
  font-family: MJXZERO, MJXTEX-A;
}

.TEX-C {
  font-family: MJXZERO, MJXTEX-C;
}

.TEX-CB {
  font-family: MJXZERO, MJXTEX-CB;
}

.TEX-FR {
  font-family: MJXZERO, MJXTEX-FR;
}

.TEX-FRB {
  font-family: MJXZERO, MJXTEX-FRB;
}

.TEX-SS {
  font-family: MJXZERO, MJXTEX-SS;
}

.TEX-SSB {
  font-family: MJXZERO, MJXTEX-SSB;
}

.TEX-SSI {
  font-family: MJXZERO, MJXTEX-SSI;
}

.TEX-SC {
  font-family: MJXZERO, MJXTEX-SC;
}

.TEX-T {
  font-family: MJXZERO, MJXTEX-T;
}

.TEX-V {
  font-family: MJXZERO, MJXTEX-V;
}

.TEX-VB {
  font-family: MJXZERO, MJXTEX-VB;
}

mjx-stretchy-v mjx-c, mjx-stretchy-h mjx-c {
  font-family: MJXZERO, MJXTEX-S1, MJXTEX-S4, MJXTEX, MJXTEX-A ! important;
}

@font-face /* 0 */ {
  font-family: MJXZERO;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Zero.woff") format("woff");
}

@font-face /* 1 */ {
  font-family: MJXTEX;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Main-Regular.woff") format("woff");
}

@font-face /* 2 */ {
  font-family: MJXTEX-B;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Main-Bold.woff") format("woff");
}

@font-face /* 3 */ {
  font-family: MJXTEX-I;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Math-Italic.woff") format("woff");
}

@font-face /* 4 */ {
  font-family: MJXTEX-MI;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Main-Italic.woff") format("woff");
}

@font-face /* 5 */ {
  font-family: MJXTEX-BI;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Math-BoldItalic.woff") format("woff");
}

@font-face /* 6 */ {
  font-family: MJXTEX-S1;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Size1-Regular.woff") format("woff");
}

@font-face /* 7 */ {
  font-family: MJXTEX-S2;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Size2-Regular.woff") format("woff");
}

@font-face /* 8 */ {
  font-family: MJXTEX-S3;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Size3-Regular.woff") format("woff");
}

@font-face /* 9 */ {
  font-family: MJXTEX-S4;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Size4-Regular.woff") format("woff");
}

@font-face /* 10 */ {
  font-family: MJXTEX-A;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_AMS-Regular.woff") format("woff");
}

@font-face /* 11 */ {
  font-family: MJXTEX-C;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Calligraphic-Regular.woff") format("woff");
}

@font-face /* 12 */ {
  font-family: MJXTEX-CB;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Calligraphic-Bold.woff") format("woff");
}

@font-face /* 13 */ {
  font-family: MJXTEX-FR;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Fraktur-Regular.woff") format("woff");
}

@font-face /* 14 */ {
  font-family: MJXTEX-FRB;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Fraktur-Bold.woff") format("woff");
}

@font-face /* 15 */ {
  font-family: MJXTEX-SS;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_SansSerif-Regular.woff") format("woff");
}

@font-face /* 16 */ {
  font-family: MJXTEX-SSB;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_SansSerif-Bold.woff") format("woff");
}

@font-face /* 17 */ {
  font-family: MJXTEX-SSI;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_SansSerif-Italic.woff") format("woff");
}

@font-face /* 18 */ {
  font-family: MJXTEX-SC;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Script-Regular.woff") format("woff");
}

@font-face /* 19 */ {
  font-family: MJXTEX-T;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Typewriter-Regular.woff") format("woff");
}

@font-face /* 20 */ {
  font-family: MJXTEX-V;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Vector-Regular.woff") format("woff");
}

@font-face /* 21 */ {
  font-family: MJXTEX-VB;
  src: url("https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/output/chtml/fonts/woff-v2//MathJax_Vector-Bold.woff") format("woff");
}

mjx-c.mjx-c31::before {
  padding: 0.666em 0.5em 0 0;
  content: "1";
}

mjx-c.mjx-c32::before {
  padding: 0.666em 0.5em 0 0;
  content: "2";
}

mjx-c.mjx-c3D::before {
  padding: 0.583em 0.778em 0.082em 0;
  content: "=";
}

mjx-c.mjx-c1D436.TEX-I::before {
  padding: 0.705em 0.76em 0.022em 0;
  content: "C";
}

[noIC] mjx-c.mjx-c1D436.TEX-I:last-child::before {
  padding-right: 0.715em;
}

mjx-c.mjx-c1D43F.TEX-I::before {
  padding: 0.683em 0.681em 0 0;
  content: "L";
}

mjx-c.mjx-c1D446.TEX-I::before {
  padding: 0.705em 0.645em 0.022em 0;
  content: "S";
}

[noIC] mjx-c.mjx-c1D446.TEX-I:last-child::before {
  padding-right: 0.613em;
}

mjx-c.mjx-c1D463.TEX-I::before {
  padding: 0.443em 0.485em 0.011em 0;
  content: "v";
}

mjx-c.mjx-c1D70C.TEX-I::before {
  padding: 0.442em 0.517em 0.216em 0;
  content: "\3C1";
}
</style>
```

## API

### `rehype().use(mathjax)`

Transform `<span class="math-inline">` and `<div class="math-display">` with
[MathJax][].

## Security

Use of `rehype-mathjax` renders user content with [MathJax][],
so any vulnerability in MathJax can open you
to a [cross-site scripting (XSS)][xss] attack.

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

[build-badge]: https://img.shields.io/travis/remarkjs/remark-math/master.svg

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

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-math/blob/master/license

[author]: https://rokt33r.github.io

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mathjax]: https://mathjax.org/
