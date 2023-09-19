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
              '<p>Inline math <span class="math-inline">\\alpha</span>.</p>',
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
              '<p>Inline math ' + katex.renderToString('\\alpha') + '.</p>',
              '<p>Block math:</p>',
              katex.renderToString('\\gamma', {displayMode: true})
            ].join('\n')
          )
      )
    )
  })

  await t.test('should support markdown fenced code', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(remarkParse)
          // @ts-expect-error: to do: remove when `remark-rehype` is released.
          .use(remarkRehype)
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process('```math\n\\gamma\n```')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(katex.renderToString('\\gamma\n', {displayMode: true}))
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
              '<p>Inline math ' + katex.renderToString('\\alpha') + '.</p>',
              '<p>Block math:</p>',
              katex.renderToString('\\gamma', {displayMode: true})
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
              '<p>Double math ' +
                katex.renderToString('\\alpha', {displayMode: true}) +
                '.</p>'
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
          .process('<span class="math-inline">\\RR</span>')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(katex.renderToString('\\RR', {macros}))
      )
    )
  })

  await t.test('should handle errors, support `errorColor`', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex, {errorColor: 'orange'})
      .use(rehypeStringify)
      .process('<span class="math-inline">\\alpa</span>')

    assert.deepEqual(
      String(file),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            katex.renderToString('\\alpa', {
              errorColor: 'orange',
              throwOnError: false
            })
          )
      )
    )

    assert.equal(file.messages.length, 1)
    const message = file.messages[0]
    assert(message)
    assert(message.cause)
    assert.match(
      String(message.cause),
      /KaTeX parse error: Undefined control sequence/
    )
    assert(message.ancestors)
    assert.equal(message.ancestors.length, 2)
    assert.deepEqual(
      {...file.messages[0], cause: undefined, ancestors: []},
      {
        ancestors: [],
        cause: undefined,
        column: 1,
        fatal: false,
        line: 1,
        message: 'Could not render math with KaTeX',
        name: '1:1-1:39',
        place: {
          start: {column: 1, line: 1, offset: 0},
          end: {column: 39, line: 1, offset: 38}
        },
        reason: 'Could not render math with KaTeX',
        ruleId: 'parseerror',
        source: 'rehype-katex'
      }
    )
  })

  await t.test('should support `strict: ignore`', async function () {
    assert.deepEqual(
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeKatex, {errorColor: 'orange', strict: 'ignore'})
          .use(rehypeStringify)
          .process('<span class="math-inline">ê&amp;</span>')
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<span class="katex-error" title="ParseError: KaTeX parse error: Expected \'EOF\', got \'&\' at position 2: ê&̲" style="color:orange">ê&amp;</span>'
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
            '<div class="math-display">\\begin{split}\n  f(-2) &= \\sqrt{-2+4} \\\\\n  &= x % Test Comment\n\\end{split}</div>'
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            katex.renderToString(
              '\\begin{split}\n  f(-2) &= \\sqrt{-2+4} \\\\\n  &= x % Test Comment\n\\end{split}',
              {displayMode: true}
            )
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
            '<span class="math-display">\\begin{split}\n\\end{{split}}\n</span>'
          )
      ),
      String(
        await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeStringify)
          .process(
            '<span class="katex-error" style="color:#cc0000" title="Error: Expected node of type textord, but got node of type ordgroup">\\begin{split}\n\\end{{split}}\n</span>'
          )
      )
    )
  })
})
