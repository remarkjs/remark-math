import test from 'tape'
import katex from 'katex'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import remarkMath from '../remark-math/index.js'
import rehypeKatex from './index.js'

test('rehype-katex', (t) => {
  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(
        [
          '<p>Inline math <span class="math-inline">\\alpha</span>.</p>',
          '<p>Block math:</p>',
          '<div class="math-display">',
          '\\begin{split}' +
            '   f(-2) &= \\sqrt{-2+4} \\\\' +
            '   &= x % Test Comment' +
            '\\end{split}',
          '</div>'
        ].join('\n')
      )
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        [
          '<p>Inline math <span class="math-inline">' +
            katex.renderToString('\\alpha') +
            '</span>.</p>',
          '<p>Block math:</p>',
          '<div class="math-display">' +
            katex.renderToString(
              '\\begin{split}\n' +
                '   f(-2) &= \\sqrt{-2+4} \\\\\n' +
                '   &= x % Test Comment\n' +
                '\\end{split}',
              {displayMode: true}
            ) +
            '</div>'
        ].join('\n')
      )
      .toString(),
    'should transform math with katex'
  )

  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(
        [
          'Inline math $\\alpha$.',
          '',
          'Block math:',
          '',
          '$$',
          '\\begin{split}' +
            '   f(-2) &= \\sqrt{-2+4} \\\\' +
            '   &= x % Test Comment' +
            '\\end{split}',
          '$$'
        ].join('\n')
      )
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        [
          '<p>Inline math <span class="math math-inline">' +
            katex.renderToString('\\alpha') +
            '</span>.</p>',
          '<p>Block math:</p>',
          '<div class="math math-display">' +
            katex.renderToString(
              '\\begin{split}\n' +
                '   f(-2) &= \\sqrt{-2+4} \\\\\n' +
                '   &= x % Test Comment\n' +
                '\\end{split}',
              {displayMode: true}
            ) +
            '</div>'
        ].join('\n')
      )
      .toString(),
    'should integrate with `remark-math`'
  )

  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(
        '<p>Double math <span class="math-inline math-display">\\alpha</span>.</p>'
      )
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<p>Double math <span class="math-inline math-display">' +
          katex.renderToString('\\alpha', {displayMode: true}) +
          '</span>.</p>'
      )
      .toString(),
    'should transform `.math-inline.math-display` math with `displayMode: true`'
  )

  const macros = {'\\RR': '\\mathbb{R}'}

  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex, {macros})
      .use(rehypeStringify)
      .processSync('<span class="math-inline">\\RR</span>')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<span class="math-inline">' +
          katex.renderToString('\\RR', {macros}) +
          '</span>'
      )
      .toString(),
    'should support `macros`'
  )

  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex, {errorColor: 'orange'})
      .use(rehypeStringify)
      .processSync('<span class="math-inline">\\alpa</span>')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<span class="math-inline">' +
          katex.renderToString('\\alpa', {
            throwOnError: false,
            errorColor: 'orange'
          }) +
          '</span>'
      )
      .toString(),
    'should support `errorColor`'
  )

  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(
        '<p>Lorem</p>\n<p><span class="math-inline">\\alpa</span></p>'
      )
      .messages.map((d) => String(d)),
    [
      '2:4-2:42: KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲'
    ],
    'should create a message for errors'
  )

  try {
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex, {throwOnError: true})
      .use(rehypeStringify)
      .processSync(
        '<p>Lorem</p>\n<p><span class="math-inline">\\alpa</span></p>'
      )
  } catch (error) {
    t.equal(
      error.message,
      'KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲',
      'should throw an error if `throwOnError: true`'
    )
  }

  t.deepEqual(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeKatex, {errorColor: 'orange', strict: 'ignore'})
      .use(rehypeStringify)
      .processSync('<span class="math-inline">ê&amp;</span>')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<span class="math-inline"><span class="katex-error" title="ParseError: KaTeX parse error: Expected \'EOF\', got \'&\' at position 2: ê&̲" style="color:orange">ê&amp;</span></span>'
      )
      .toString(),
    'should support `strict: ignore`'
  )

  t.end()
})
