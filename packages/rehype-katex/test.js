import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import rehypeKatex from 'rehype-katex'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

test('rehype-katex', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-katex')).sort(), [
      'default'
    ])
  })

  await t.test('should transform math with katex', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process(
            [
              '<p>Inline math <code class="math-inline">\\alpha</code>.</p>',
              '<p>Block math:</p>',
              '<div class="math-display">\\gamma</div>'
            ].join('\n')
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            [
              '<p>Inline math <code class="math-inline">' +
                katex.renderToString('\\alpha') +
                '</code>.</p>',
              '<p>Block math:</p>',
              '<div class="math-display">' +
                katex.renderToString('\\gamma', {displayMode: true}) +
                '</div>'
            ].join('\n')
          )
      )
    )
  })

  await t.test('should integrate with `remark-math`', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkParse)
          .use(remarkMath)
          // @ts-expect-error: to do: remove when `remark-rehype` is released.
          .use(remarkRehype)
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process(
            [
              'Inline math $\\alpha$.',
              '',
              'Block math:',
              '',
              '$$',
              '\\gamma',
              '$$'
            ].join('\n')
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            [
              '<p>Inline math <code class="language-math math-inline">' +
                katex.renderToString('\\alpha') +
                '</code>.</p>',
              '<p>Block math:</p>',
              '<pre><code class="language-math math-display">' +
                katex.renderToString('\\gamma', {displayMode: true}) +
                '</code></pre>'
            ].join('\n')
          )
      )
    )
  })

  await t.test(
    'should transform `.math-inline.math-display` math with `displayMode: true`',
    async function () {
      assert.deepEqual(
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeKatex)
            .use(rehypeStringify)
            .process(
              '<p>Double math <code class="math-inline math-display">\\alpha</code>.</p>'
            )
        ),
        String(
          await unified()
            .use(rehypeParse, {fragment: true})
            .use(rehypeStringify)
            .process(
              '<p>Double math <code class="math-inline math-display">' +
                katex.renderToString('\\alpha', {displayMode: true}) +
                '</code>.</p>'
            )
        )
      )
    }
  )

  await t.test('should support `macros`', async function () {
    const macros = {'\\RR': '\\mathbb{R}'}

    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {macros})
          .use(rehypeStringify)
          .process('<code class="math-inline">\\RR</code>')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<code class="math-inline">' +
              katex.renderToString('\\RR', {macros}) +
              '</code>'
          )
      )
    )
  })

  await t.test('should support `errorColor`', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {errorColor: 'orange'})
          .use(rehypeStringify)
          .process('<code class="math-inline">\\alpa</code>')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<code class="math-inline">' +
              katex.renderToString('\\alpa', {
                errorColor: 'orange',
                throwOnError: false
              }) +
              '</code>'
          )
      )
    )
  })

  await t.test('should create a message for errors', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process('<p>Lorem</p>\n<p><code class="math-inline">\\alpa</code></p>')

    assert.deepEqual(file.messages.map(String), [
      '2:4-2:42: KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲'
    ])
  })

  await t.test(
    'should throw an error if `throwOnError: true`',
    async function () {
      try {
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {throwOnError: true})
          .use(rehypeStringify)
          .process(
            '<p>Lorem</p>\n<p><code class="math-inline">\\alpa</code></p>'
          )
        /* c8 ignore next 2 -- some c8 bug. */
        assert.fail()
      } catch (error) {
        assert.match(
          String(error),
          /KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲/
        )
      }
    }
  )

  await t.test('should support `strict: ignore`', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {errorColor: 'orange', strict: 'ignore'})
          .use(rehypeStringify)
          .process('<code class="math-inline">ê&amp;</code>')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<code class="math-inline"><span class="katex-error" title="ParseError: KaTeX parse error: Expected \'EOF\', got \'&\' at position 2: ê&̲" style="color:orange">ê&amp;</span></code>'
          )
      )
    )
  })

  await t.test('should support comments', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {errorColor: 'orange', strict: 'ignore'})
          .use(rehypeStringify)
          .process(
            '<div class="math math-display">\\begin{split}\n  f(-2) &= \\sqrt{-2+4} \\\\\n  &= x % Test Comment\n\\end{split}</div>'
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<div class="math math-display">' +
              katex.renderToString(
                '\\begin{split}\n  f(-2) &= \\sqrt{-2+4} \\\\\n  &= x % Test Comment\n\\end{split}',
                {displayMode: true}
              ) +
              '</div>'
          )
      )
    )
  })

  await t.test('should not crash on non-parse errors', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process(
            '<code class="math-display">\\begin{split}\n\\end{{split}}\n</code>'
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<code class="math-display"><span class="katex-error" style="color:#cc0000" title="Error: Expected node of type textord, but got node of type ordgroup">\\begin{split}\n\\end{{split}}\n</span></code>'
          )
      )
    )
  })
})
