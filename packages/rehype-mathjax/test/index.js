import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import rehypeMathJaxBrowser from 'rehype-mathjax/browser'
import rehypeMathJaxChtml from 'rehype-mathjax/chtml'
import rehypeMathJaxSvg from 'rehype-mathjax/svg'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const base = new URL('fixture/', import.meta.url)

test('rehype-mathjax', async function (t) {
  await t.test(
    'should expose the public api for `rehype-mathjax`',
    async function () {
      assert.deepEqual(Object.keys(await import('rehype-mathjax')).sort(), [
        'default'
      ])
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/browser`',
    async function () {
      assert.deepEqual(
        Object.keys(await import('rehype-mathjax/browser')).sort(),
        ['default']
      )
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/chtml`',
    async function () {
      assert.deepEqual(
        Object.keys(await import('rehype-mathjax/chtml')).sort(),
        ['default']
      )
    }
  )

  await t.test(
    'should expose the public api for `rehype-mathjax/svg`',
    async function () {
      assert.deepEqual(Object.keys(await import('rehype-mathjax/svg')).sort(), [
        'default'
      ])
    }
  )

  await t.test('should render SVG', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('small.html', base)))
      ),
      String(await fs.readFile(new URL('small-svg.html', base))).trim()
    )
  })

  await t.test('should crash for CHTML w/o `fontURL`', async function () {
    try {
      await unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml)
        .use(rehypeStringify)
        .process(
          await fs.readFile(new URL('equation-numbering-2-svg.html', base))
        )
      assert.fail()
    } catch (error) {
      assert.match(
        String(error),
        /rehype-mathjax: missing `fontURL` in options/
      )
    }
  })

  await t.test('should render CHTML', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxChtml, {chtml: {fontURL: 'place/to/fonts'}})
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('small.html', base)))
      ),
      String(await fs.readFile(new URL('small-chtml.html', base))).trim()
    )
  })

  await t.test('should render browser', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxBrowser)
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('small.html', base)))
      ),
      String(await fs.readFile(new URL('small-browser.html', base)))
    )
  })

  await t.test('should support markdown fenced code', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkParse)
          // @ts-expect-error: to do: remove when `remark-rehype` is released.
          .use(remarkRehype)
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .process('```math\n\\gamma\n```')
      ),
      String(
        await fs.readFile(new URL('markdown-code-fenced-svg.html', base))
      ).trim()
    )
  })

  await t.test('should integrate with `remark-math`', async function () {
    assert.equal(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkMath)
          // @ts-expect-error: to do: remove when `remark-rehype` is released.
          .use(remarkRehype)
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('markdown.md', base)))
      ),
      String(await fs.readFile(new URL('markdown-svg.html', base))).trim()
    )
  })

  await t.test(
    'should transform `.math-inline.math-display`',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeMathJaxSvg)
            .use(rehypeStringify)
            .process(await fs.readFile(new URL('double.html', base)))
        ),
        String(await fs.readFile(new URL('double-svg.html', base))).trim()
      )
    }
  )

  await t.test('should transform documents without math', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('none.html', base)))
      ),
      String(await fs.readFile(new URL('none-svg.html', base)))
    )
  })

  await t.test('should transform complete documents', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse)
          .use(rehypeMathJaxSvg)
          .use(rehypeStringify)
          .process(await fs.readFile(new URL('document.html', base)))
      ),
      String(await fs.readFile(new URL('document-svg.html', base))).trim()
    )
  })

  await t.test(
    'should support custom `inlineMath` and `displayMath` delimiters for browser',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeMathJaxBrowser, {
              tex: {
                displayMath: [['$$', '$$']],
                inlineMath: [['$', '$']]
              }
            })
            .use(rehypeStringify)
            .process(await fs.readFile(new URL('small.html', base)))
        ),
        String(
          await fs.readFile(new URL('small-browser-delimiters.html', base))
        )
      )
    }
  )

  await t.test('should render SVG with equation numbers', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
          .use(rehypeStringify)
          .process(
            await fs.readFile(new URL('equation-numbering-1.html', base))
          )
      ),
      String(
        await fs.readFile(new URL('equation-numbering-1-svg.html', base))
      ).trim()
    )
  })

  await t.test(
    'should render SVG with reference to an undefined equation',
    async function () {
      assert.equal(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
            .use(rehypeStringify)
            .process(
              await fs.readFile(new URL('equation-numbering-2.html', base))
            )
        ),
        String(
          await fs.readFile(new URL('equation-numbering-2-svg.html', base))
        ).trim()
      )
    }
  )

  await t.test('should render CHTML with equation numbers', async function () {
    assert.equal(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeMathJaxChtml, {
            chtml: {fontURL: 'place/to/fonts'},
            tex: {tags: 'ams'}
          })
          .use(rehypeStringify)
          .process(
            await fs.readFile(new URL('equation-numbering-1.html', base))
          )
      ),
      String(
        await fs.readFile(new URL('equation-numbering-1-chtml.html', base))
      ).trim()
    )
  })
})
