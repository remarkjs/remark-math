const math = require('../packages/remark-math')
const katex = require('katex')
const remarkHtmlKatex = require('../packages/remark-html-katex')
const unified = require('unified')
const parse = require('remark-parse')
const html = require('remark-html')
const rehypeParse = require('rehype-parse')
const u = require('unist-builder')
const h = require('hastscript')

function remark () {
  return unified()
    .use(parse)
}

function parseHtml (html) {
  return unified()
    .use(rehypeParse, {fragment: true, position: false})
    .parse(html)
}

it('should parse into katex', () => {
  const processor = remark()
    .use(math)
    .use(remarkHtmlKatex)
    .use(html)

  const targetText = [
    '$\\alpha$',
    '$$',
    '\\alpha\\beta',
    '$$'
  ].join('\n')

  const result = processor.processSync(targetText).toString()
  const renderedAst = parseHtml(result)

  const expectedInlineMathChildren = parseHtml(katex.renderToString('\\alpha')).children
  const expectedMath = parseHtml(katex.renderToString('\\alpha\\beta', {displayMode: true})).children

  expect(renderedAst)
    .toEqual(u('root', {data: {quirksMode: false}}, [
      h('p', [
        h('span', {className: 'inlineMath'}, expectedInlineMathChildren)
      ]),
      u('text', '\n'),
      h('div', {className: 'math'}, expectedMath),
      u('text', '\n')
    ]))
})

it('should handle error', () => {
  const processor = remark()
    .use(math)
    .use(remarkHtmlKatex, {
      errorColor: 'orange'
    })
    .use(html)

  const targetText = '$\\alpa$'

  const result = processor.processSync(targetText)
  const renderedAst = parseHtml(result.toString())

  const expectedInlineMathChildren = parseHtml(katex.renderToString('\\alpa', {
    throwOnError: false,
    errorColor: 'orange'
  })).children

  expect(renderedAst)
    .toEqual(u('root', {data: {quirksMode: false}}, [
      h('p', [
        h('span', {className: 'inlineMath'}, expectedInlineMathChildren)
      ]),
      u('text', '\n')
    ]))

  expect(result.messages[0].message).toEqual('KaTeX parse error: Expected \'EOF\', got \'\\alpa\' at position 1: \\̲a̲l̲p̲a̲')
})

it('should handle error even fallback rendering failed', () => {
  const processor = remark()
    .use(math)
    .use(remarkHtmlKatex, {
      errorColor: 'orange'
    })
    .use(html)

  const targetText = '$ê$'

  const result = processor.processSync(targetText)
  const renderedAst = parseHtml(result.toString())

  expect(renderedAst)
    .toEqual(u('root', {data: {quirksMode: false}}, [
      h('p', [
        h('span', {className: 'inlineMath'}, [
          h('code', {className: 'katex', style: 'color: orange'}, 'ê')
        ])
      ]),
      u('text', '\n')
    ]))
})

it('should throw parsing error if `throwOnError` set true', () => {
  const processor = remark()
    .use(math)
    .use(remarkHtmlKatex, {
      throwOnError: true
    })
    .use(html)

  const targetText = '$\\alpa$'

  expect(() => {
    processor.processSync(targetText)
  }).toThrow('KaTeX parse error: Expected \'EOF\', got \'\\alpa\'')
})
