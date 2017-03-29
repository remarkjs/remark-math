const math = require('../packages/remark-math')
const katex = require('katex')
const rehypeKatex = require('../packages/rehype-katex')
const unified = require('unified')
const parse = require('remark-parse')
const rehype = require('rehype')
const remark2rehype = require('remark-rehype')
const stringify = require('rehype-stringify')
const toHtml = require('hast-util-to-html')

function remark () {
  return unified()
    .use(parse)
}

function parseHtml (html) {
  return rehype().parse(html, {fragment: true})
}

it('should parse into katex', () => {
  const processor = remark()
    .use(math)
    .use(remark2rehype)
    .use(rehypeKatex)
    .use(stringify)

  const targetText = [
    '$\\alpha$',
    '$$',
    '\\alpha\\beta',
    '$$',
    'foo $$\\alpha$$ bar'
  ].join('\n')

  const result = processor.processSync(targetText).toString()
  const renderedAst = parseHtml(result)

  const expectedInlineMath = katex.renderToString('\\alpha')

  const child1 = renderedAst.children[0]
  expect(child1.type).toEqual('element')
  expect(child1.tagName).toEqual('p')
  expect(child1.children[0].tagName).toEqual('span')
  expect(child1.children[0].properties.className).toEqual(expect.arrayContaining(['inlineMath']))
  expect(toHtml(child1.children[0].children[0], {fragment: true})).toEqual(expectedInlineMath)

  const expectedMath = katex.renderToString('\\alpha\\beta', {displayMode: true})

  const child2 = renderedAst.children[2]
  expect(child2.tagName).toEqual('div')
  expect(child2.properties.className).toEqual(expect.arrayContaining(['math']))
  expect(child2.children[0].children[0].properties.className).toEqual(expect.arrayContaining(['katex']))
  expect(toHtml(child2.children[0], {fragment: true})).toEqual(expectedMath)

  const child3 = renderedAst.children[4]
  expect(child3.children[1].properties.className).toEqual(expect.arrayContaining(['inlineMath', 'inlineMathDouble']))
  expect(child3.children[1].children[0].properties.className).toEqual(expect.arrayContaining(['katex']))
})

it('should put inlineDoubles in katex displaystyle', () => {
  const processor = remark()
    .use(math)
    .use(remark2rehype)
    .use(rehypeKatex, {
      inlineDoubleDisplay: true
    })
    .use(stringify)

  const targetText = [
    '$\\alpha$',
    '$$',
    '\\alpha\\beta',
    '$$',
    'foo $$\\alpha$$ bar'
  ].join('\n')

  const result = processor.processSync(targetText).toString()
  const renderedAst = parseHtml(result)

  const expectedInlineMath = katex.renderToString('\\alpha')

  const child1 = renderedAst.children[0]
  expect(child1.type).toEqual('element')
  expect(child1.tagName).toEqual('p')
  expect(child1.children[0].tagName).toEqual('span')
  expect(child1.children[0].properties.className).toEqual(expect.arrayContaining(['inlineMath']))
  expect(toHtml(child1.children[0].children[0], {fragment: true})).toEqual(expectedInlineMath)

  const expectedMath = katex.renderToString('\\alpha\\beta', {displayMode: true})

  const child2 = renderedAst.children[2]
  expect(child2.tagName).toEqual('div')
  expect(child2.properties.className).toEqual(expect.arrayContaining(['math']))
  expect(child2.children[0].children[0].properties.className).toEqual(expect.arrayContaining(['katex']))
  expect(toHtml(child2.children[0], {fragment: true})).toEqual(expectedMath)

  const child3 = renderedAst.children[4]
  expect(child3.children[1].properties.className).toEqual(expect.arrayContaining(['inlineMath', 'inlineMathDouble']))
  expect(child3.children[1].children[0].properties.className).toEqual(expect.arrayContaining(['katex-display']))
})

it('should handle error', () => {
  const processor = remark()
    .use(math)
    .use(remark2rehype)
    .use(rehypeKatex, {
      errorColor: 'orange'
    })
    .use(stringify)

  const targetText = '$\\alpa$'

  const result = processor.processSync(targetText)
  const renderedAst = parseHtml(result.toString())

  const expectedInlineMath = katex.renderToString('\\alpa', {
    throwOnError: false,
    errorColor: 'orange'
  })

  const child1 = renderedAst.children[0]
  expect(child1.type).toEqual('element')
  expect(child1.tagName).toEqual('p')
  expect(child1.children[0].tagName).toEqual('span')
  expect(child1.children[0].properties.className).toEqual(expect.arrayContaining(['inlineMath']))
  expect(toHtml(child1.children[0].children[0], {fragment: true})).toEqual(expectedInlineMath)

  expect(result.messages[0].message).toEqual('KaTeX parse error: Expected \'EOF\', got \'\\alpa\' at position 1: \\̲a̲l̲p̲a̲')
})

it('should throw parsing error if `throwOnError` set true', () => {
  const processor = remark()
    .use(math)
    .use(remark2rehype)
    .use(rehypeKatex, {
      throwOnError: true
    })
    .use(stringify)

  const targetText = '$\\alpa$'

  expect(() => {
    processor.processSync(targetText)
  }).toThrow('KaTeX parse error: Expected \'EOF\', got \'\\alpa\'')
})
