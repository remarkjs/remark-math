const path = require('path')
const test = require('tape')
const vfile = require('to-vfile')
const unified = require('unified')
const parseMarkdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const parseHtml = require('rehype-parse')
const stringify = require('rehype-stringify')
const math = require('../../remark-math')
const svg = require('..')
const chtml = require('../chtml')
const browser = require('../browser')

const fixtures = path.join(__dirname, 'fixture')

test('rehype-mathjax', function (t) {
  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(svg)
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(
      vfile.readSync({dirname: fixtures, basename: 'small-svg.html'})
    ).trim(),
    'should render SVG'
  )

  t.throws(
    function () {
      unified().use(chtml).freeze()
    },
    /rehype-mathjax: missing `fontURL` in options/,
    'should crash for CHTML w/o `fontURL`'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(chtml, {fontURL: 'place/to/fonts'})
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(
      vfile.readSync({dirname: fixtures, basename: 'small-chtml.html'})
    ).trim(),
    'should render CHTML'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(browser)
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(vfile.readSync({dirname: fixtures, basename: 'small-browser.html'})),
    'should render browser'
  )

  t.equal(
    unified()
      .use(parseMarkdown)
      .use(math)
      .use(remark2rehype)
      .use(svg)
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'markdown.md'}))
      .toString(),
    String(
      vfile.readSync({dirname: fixtures, basename: 'markdown-svg.html'})
    ).trim(),
    'should integrate with `remark-math`'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(svg)
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'double.html'}))
      .toString(),
    String(
      vfile.readSync({dirname: fixtures, basename: 'double-svg.html'})
    ).trim(),
    'should transform `.math-inline.math-display`'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(svg)
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'none.html'}))
      .toString(),
    String(vfile.readSync({dirname: fixtures, basename: 'none-svg.html'})),
    'should transform documents without math'
  )

  t.equal(
    unified()
      .use(parseHtml)
      .use(svg)
      .use(stringify)
      .processSync(
        vfile.readSync({dirname: fixtures, basename: 'document.html'})
      )
      .toString(),
    String(
      vfile.readSync({dirname: fixtures, basename: 'document-svg.html'})
    ).trim(),
    'should transform complete documents'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(browser, {inlineMath: ['$', '$'], displayMath: ['$$', '$$']})
      .use(stringify)
      .processSync(vfile.readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(
      vfile.readSync({
        dirname: fixtures,
        basename: 'small-browser-delimiters.html'
      })
    ),
    'should support custom `inlineMath` and `displayMath` delimiters for browser'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(svg, {tex: {tags: 'ams'}})
      .use(stringify)
      .processSync(
        vfile.readSync({
          dirname: fixtures,
          basename: 'equation-numbering-1.html'
        })
      )
      .toString(),
    String(
      vfile.readSync({
        dirname: fixtures,
        basename: 'equation-numbering-1-svg.html'
      })
    ).trim(),
    'should render SVG with equation numbers'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(svg, {tex: {tags: 'ams'}})
      .use(stringify)
      .processSync(
        vfile.readSync({
          dirname: fixtures,
          basename: 'equation-numbering-2.html'
        })
      )
      .toString(),
    String(
      vfile.readSync({
        dirname: fixtures,
        basename: 'equation-numbering-2-svg.html'
      })
    ).trim(),
    'should render SVG with reference to an undefined equation'
  )

  t.equal(
    unified()
      .use(parseHtml, {fragment: true})
      .use(chtml, {fontURL: 'place/to/fonts', tex: {tags: 'ams'}})
      .use(stringify)
      .processSync(
        vfile.readSync({
          dirname: fixtures,
          basename: 'equation-numbering-1.html'
        })
      )
      .toString(),
    String(
      vfile.readSync({
        dirname: fixtures,
        basename: 'equation-numbering-1-chtml.html'
      })
    ).trim(),
    'should render CHTML with equation numbers'
  )

  t.equal(
    (() => {
      const processor = unified()
        .use(parseHtml, {fragment: true})
        .use(svg, {tex: {tags: 'ams'}})
        .use(stringify)
      return ['equation-numbering-1.html', 'equation-numbering-2.html']
        .map((basename) =>
          processor
            .processSync(
              vfile.readSync({
                dirname: fixtures,
                basename: basename
              })
            )
            .toString()
        )
        .join('')
    })(),
    [
      String(
        vfile.readSync({
          dirname: fixtures,
          basename: 'equation-numbering-1-svg.html'
        })
      ).trim(),
      String(
        vfile.readSync({
          dirname: fixtures,
          basename: 'equation-numbering-2-svg.html'
        })
      ).trim()
    ].join(''),
    'should render SVG with equation numbers'
  )

  t.end()
})
