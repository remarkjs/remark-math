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
    .use(parse, {position: false})
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
    '$$'
  ].join('\n')

  const result = processor.processSync(targetText).toString()
  const renderedAst = parseHtml(result)

  const expectedInlineMath = katex.renderToString('\\alpha')

  expect(renderedAst.children[0].type).toEqual('element')
  expect(renderedAst.children[0].tagName).toEqual('p')
  expect(renderedAst.children[0].children[0].tagName).toEqual('span')
  expect(renderedAst.children[0].children[0].properties.className).toEqual(expect.arrayContaining(['inlineMath']))
  expect(toHtml(renderedAst.children[0].children[0].children[0], {fragment: true})).toEqual(expectedInlineMath)

  const expectedMath = katex.renderToString('\\alpha\\beta', {displayMode: true})

  expect(renderedAst.children[2].tagName).toEqual('div')
  expect(renderedAst.children[2].properties.className).toEqual(expect.arrayContaining(['math']))
  expect(toHtml(renderedAst.children[2].children[0], {fragment: true})).toEqual(expectedMath)
})
