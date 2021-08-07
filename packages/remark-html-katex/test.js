import test from 'tape'
import katex from 'katex'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import remarkHtml from 'remark-html'
import remarkMath from '../remark-math/index.js'
import remarkHtmlKatex from './index.js'

test('remark-html-katex', (t) => {
  t.deepEqual(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkHtmlKatex)
      .use(remarkHtml)
      .processSync(
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
            katex.renderToString('\\gamma', {displayMode: true}) +
            '</div>',
          ''
        ].join('\n')
      )
      .toString(),
    'should transform math with katex'
  )

  const macros = {'\\RR': '\\mathbb{R}'}

  t.deepEqual(
    unified()
      .use(remarkParse, {position: false})
      .use(remarkMath)
      .use(remarkHtmlKatex, {macros})
      .use(remarkHtml)
      .processSync('$\\RR$')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<p><span class="math math-inline">' +
          katex.renderToString('\\RR', {macros}) +
          '</span></p>\n'
      )
      .toString(),
    'should support `macros`'
  )

  t.deepEqual(
    unified()
      .use(remarkParse, {position: false})
      .use(remarkMath)
      .use(remarkHtmlKatex, {errorColor: 'orange'})
      .use(remarkHtml)
      .processSync('$\\alpa$')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<p><span class="math math-inline">' +
          katex.renderToString('\\alpa', {
            throwOnError: false,
            errorColor: 'orange'
          }) +
          '</span></p>\n'
      )
      .toString(),
    'should support `errorColor`'
  )

  t.deepLooseEqual(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkHtmlKatex)
      .use(remarkHtml)
      .processSync('Lorem\n$\\alpa$')
      .messages.map((d) => String(d)),
    [
      '2:1-2:8: KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲'
    ],
    'should create a message for errors'
  )

  try {
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkHtmlKatex, {throwOnError: true})
      .use(remarkHtml)
      .processSync('Lorem\n$\\alpa$')
  } catch (error) {
    t.equal(
      error.message,
      'KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲',
      'should throw an error if `throwOnError: true`'
    )
  }

  t.deepEqual(
    unified()
      .use(remarkParse, {position: false})
      .use(remarkMath)
      .use(remarkHtmlKatex, {errorColor: 'orange', strict: 'ignore'})
      .use(remarkHtml)
      .processSync('$ê&$')
      .toString(),
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeStringify)
      .processSync(
        '<p><span class="math math-inline"><span class="katex-error" title="ParseError: KaTeX parse error: Expected \'EOF\', got \'&\' at position 2: ê&̲" style="color:orange">ê&amp;</span></span></p>\n'
      )
      .toString(),
    'should support `strict: ignore`'
  )

  t.end()
})
