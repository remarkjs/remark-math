import assert from 'node:assert/strict'
import test from 'node:test'
import path from 'node:path'
import {readSync} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import remarkMath from '../../remark-math/index.js'
import rehypeMathJaxSvg from '../svg.js'
import rehypeMathJaxChtml from '../chtml.js'
import rehypeMathJaxBrowser from '../browser.js'

const fixtures = path.join('test', 'fixture')

test('rehype-mathjax', async function (t) {
  await t.test('should render SVG', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
        .toString(),
      String(readSync({dirname: fixtures, basename: 'small-svg.html'})).trim()
    )
  })

  await t.test('should crash for CHTML w/o `fontURL`', async function () {
    assert.throws(function () {
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
        .toString()
    }, /rehype-mathjax: missing `fontURL` in options/)
  })

  await t.test('should render CHTML', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml, {chtml: {fontURL: 'place/to/fonts'}})
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
        .toString(),
      String(readSync({dirname: fixtures, basename: 'small-chtml.html'})).trim()
    )
  })

  await t.test('should render browser', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxBrowser)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
        .toString(),
      String(readSync({dirname: fixtures, basename: 'small-browser.html'}))
    )
  })

  await t.test('should integrate with `remark-math`', async function () {
    assert.equal(
      unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'markdown.md'}))
        .toString(),
      String(
        readSync({dirname: fixtures, basename: 'markdown-svg.html'})
      ).trim()
    )
  })

  await t.test(
    'should transform `.math-inline.math-display`',
    async function () {
      assert.equal(
        unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .processSync(readSync({dirname: fixtures, basename: 'double.html'}))
          .toString(),
        String(
          readSync({dirname: fixtures, basename: 'double-svg.html'})
        ).trim()
      )
    }
  )

  await t.test('should transform documents without math', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'none.html'}))
        .toString(),
      String(readSync({dirname: fixtures, basename: 'none-svg.html'}))
    )
  })

  await t.test('should transform complete documents', async function () {
    assert.equal(
      unified()
        .use(rehypeParse)
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .processSync(readSync({dirname: fixtures, basename: 'document.html'}))
        .toString(),
      String(
        readSync({dirname: fixtures, basename: 'document-svg.html'})
      ).trim()
    )
  })

  await t.test(
    'should support custom `inlineMath` and `displayMath` delimiters for browser',
    async function () {
      assert.equal(
        unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxBrowser, {
            tex: {
              inlineMath: [['$', '$']],
              displayMath: [['$$', '$$']]
            }
          })
          .use(rehypeStringify)
          .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
          .toString(),
        String(
          readSync({
            dirname: fixtures,
            basename: 'small-browser-delimiters.html'
          })
        )
      )
    }
  )

  await t.test('should render SVG with equation numbers', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
        .use(rehypeStringify)
        .processSync(
          readSync({
            dirname: fixtures,
            basename: 'equation-numbering-1.html'
          })
        )
        .toString(),
      String(
        readSync({
          dirname: fixtures,
          basename: 'equation-numbering-1-svg.html'
        })
      ).trim()
    )
  })

  await t.test(
    'should render SVG with reference to an undefined equation',
    async function () {
      assert.equal(
        unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
          .use(rehypeStringify)
          .processSync(
            readSync({
              dirname: fixtures,
              basename: 'equation-numbering-2.html'
            })
          )
          .toString(),
        String(
          readSync({
            dirname: fixtures,
            basename: 'equation-numbering-2-svg.html'
          })
        ).trim()
      )
    }
  )

  await t.test('should render CHTML with equation numbers', async function () {
    assert.equal(
      unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml, {
          chtml: {fontURL: 'place/to/fonts'},
          tex: {tags: 'ams'}
        })
        .use(rehypeStringify)
        .processSync(
          readSync({
            dirname: fixtures,
            basename: 'equation-numbering-1.html'
          })
        )
        .toString(),
      String(
        readSync({
          dirname: fixtures,
          basename: 'equation-numbering-1-chtml.html'
        })
      ).trim()
    )
  })

  await t.test('should render SVG with equation numbers', async function () {
    assert.equal(
      (function () {
        const processor = unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
          .use(rehypeStringify)
        return ['equation-numbering-1.html', 'equation-numbering-2.html']
          .map(function (basename) {
            return processor
              .processSync(
                readSync({
                  dirname: fixtures,
                  basename
                })
              )
              .toString()
          })
          .join('')
      })(),
      [
        String(
          readSync({
            dirname: fixtures,
            basename: 'equation-numbering-1-svg.html'
          })
        ).trim(),
        String(
          readSync({
            dirname: fixtures,
            basename: 'equation-numbering-2-svg.html'
          })
        ).trim()
      ].join('')
    )
  })
})
