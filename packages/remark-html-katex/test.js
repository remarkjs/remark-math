const test = require('tape')
const katex = require('katex')
const unified = require('unified')
const parseMarkdown = require('remark-parse')
const parseHtml = require('rehype-parse')
const stringify = require('rehype-stringify')
const html = require('remark-html')
const math = require('../remark-math')
const htmlKatex = require('.')

test('remark-html-katex', function (t) {
  t.deepEqual(
    unified()
      .use(parseMarkdown, {position: false})
      .use(math)
      .use(htmlKatex)
      .use(html)
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
      .use(parseHtml, {fragment: true, position: false})
      .use(stringify)
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

  var macros = {'\\RR': '\\mathbb{R}'}

  t.deepEqual(
    unified()
      .use(parseMarkdown, {position: false})
      .use(math)
      .use(htmlKatex, {macros: macros})
      .use(html)
      .processSync('$\\RR$')
      .toString(),
    unified()
      .use(parseHtml, {fragment: true, position: false})
      .use(stringify)
      .processSync(
        '<p><span class="math math-inline">' +
          katex.renderToString('\\RR', {macros: macros}) +
          '</span></p>\n'
      )
      .toString(),
    'should support `macros`'
  )

  t.deepEqual(
    unified()
      .use(parseMarkdown, {position: false})
      .use(math)
      .use(htmlKatex, {errorColor: 'orange'})
      .use(html)
      .processSync('$\\alpa$')
      .toString(),
    unified()
      .use(parseHtml, {fragment: true, position: false})
      .use(stringify)
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

  t.deepEqual(
    unified()
      .use(parseMarkdown)
      .use(math)
      .use(htmlKatex)
      .use(html)
      .processSync('Lorem\n$\\alpa$').messages,
    [
      {
        message:
          'KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲',
        name: '2:1-2:8',
        reason:
          'KaTeX parse error: Undefined control sequence: \\alpa at position 1: \\̲a̲l̲p̲a̲',
        line: 2,
        column: 1,
        location: {
          start: {line: 2, column: 1, offset: 6},
          end: {line: 2, column: 8, offset: 13},
          indent: []
        },
        source: 'remark-html-katex',
        ruleId: 'parseerror',
        fatal: false
      }
    ],
    'should create a message for errors'
  )

  try {
    unified()
      .use(parseMarkdown)
      .use(math)
      .use(htmlKatex, {throwOnError: true})
      .use(html)
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
      .use(parseMarkdown, {position: false})
      .use(math)
      .use(htmlKatex, {errorColor: 'orange', strict: 'ignore'})
      .use(html)
      .processSync('$ê&$')
      .toString(),
    unified()
      .use(parseHtml, {fragment: true, position: false})
      .use(stringify)
      .processSync(
        '<p><span class="math math-inline"><span class="katex-error" title="ParseError: KaTeX parse error: Expected \'EOF\', got \'&\' at position 2: ê&̲" style="color:orange">ê&amp;</span></span></p>\n'
      )
      .toString(),
    'should support `strict: ignore`'
  )

  t.end()
})
