import path from 'path'
import test from 'tape'
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

test('rehype-mathjax', function (t) {
  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxSvg)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'small-svg.html'})).trim(),
    'should render SVG'
  )

  t.throws(
    function () {
      unified().use(rehypeMathJaxChtml).freeze()
    },
    /rehype-mathjax: missing `fontURL` in options/,
    'should crash for CHTML w/o `fontURL`'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxChtml, {fontURL: 'place/to/fonts'})
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'small-chtml.html'})).trim(),
    'should render CHTML'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxBrowser)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'small-browser.html'})),
    'should render browser'
  )

  t.equal(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeMathJaxSvg)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'markdown.md'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'markdown-svg.html'})).trim(),
    'should integrate with `remark-math`'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxSvg)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'double.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'double-svg.html'})).trim(),
    'should transform `.math-inline.math-display`'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxSvg)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'none.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'none-svg.html'})),
    'should transform documents without math'
  )

  t.equal(
    unified()
      .use(rehypeParse)
      .use(rehypeMathJaxSvg)
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'document.html'}))
      .toString(),
    String(readSync({dirname: fixtures, basename: 'document-svg.html'})).trim(),
    'should transform complete documents'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxBrowser, {
        inlineMath: ['$', '$'],
        displayMath: ['$$', '$$']
      })
      .use(rehypeStringify)
      .processSync(readSync({dirname: fixtures, basename: 'small.html'}))
      .toString(),
    String(
      readSync({
        dirname: fixtures,
        basename: 'small-browser-delimiters.html'
      })
    ),
    'should support custom `inlineMath` and `displayMath` delimiters for browser'
  )

  t.equal(
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
    ).trim(),
    'should render SVG with equation numbers'
  )

  t.equal(
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
    ).trim(),
    'should render SVG with reference to an undefined equation'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeMathJaxChtml, {fontURL: 'place/to/fonts', tex: {tags: 'ams'}})
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
    ).trim(),
    'should render CHTML with equation numbers'
  )

  t.equal(
    (() => {
      const processor = unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
        .use(rehypeStringify)
      return ['equation-numbering-1.html', 'equation-numbering-2.html']
        .map((basename) =>
          processor
            .processSync(
              readSync({
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
    ].join(''),
    'should render SVG with equation numbers'
  )

  t.end()
})
