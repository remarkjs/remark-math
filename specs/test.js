const math = require('../index')
const unified = require('unified')
const parse = require('remark-parse')

function remark () {
  return unified()
    .use(parse)
}

it('should parse a math inline and a math block ', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math $\\alpha$\n\n$$\n\\beta+\\gamma\n$$'

  const ast = processor.parse(targetText)
  expect(ast.children[0].type).toEqual('paragraph')
  expect(ast.children[0].children[0].type).toEqual('text')
  expect(ast.children[0].children[0].value).toEqual('Math ')
  expect(ast.children[0].children[1].type).toEqual('inlineMath')
  expect(ast.children[0].children[1].children[0].value).toEqual('\\alpha')
  expect(ast.children[1].type).toEqual('math')
  expect(ast.children[1].children[0].type).toEqual('text')
  expect(ast.children[1].children[0].value).toEqual('\\beta+\\gamma')
})

it('should escape a dollar with back slash', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math \\$\\alpha\\$\n'

  const ast = processor.parse(targetText)
  expect(ast.children[0].children[0].value).toEqual('Math ')
  expect(ast.children[0].children[1].value).toEqual('$')
  expect(ast.children[0].children[2].value).toEqual('\\alpha')
  expect(ast.children[0].children[3].value).toEqual('$')
})

it('should NOT escape a dollar with double backslashes', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math \\\\$\\alpha$\n'

  const ast = processor.parse(targetText)

  expect(ast.children[0].children[0].value).toEqual('Math ')
  expect(ast.children[0].children[1].value).toEqual('\\')
  expect(ast.children[0].children[2].type).toEqual('inlineMath')
})

it('should render a super factorial to a math block', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math $a\\$$\n'

  const ast = processor.parse(targetText)
  expect(ast.children[0].children[0].value).toEqual('Math ')
  expect(ast.children[0].children[1].type).toEqual('inlineMath')
  expect(ast.children[0].children[1].children[0].value).toEqual('a\\$')
})

it('should render super factorial to a math inline', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math\n\n$$\na\\$\n$$\n'

  const ast = processor.parse(targetText)
  expect(ast.children[0].children[0].value).toEqual('Math')
  expect(ast.children[1].type).toEqual('math')
  expect(ast.children[1].children[0].value).toEqual('a\\$')
})

it('should render a math block just after a pragraph', () => {
  const processor = remark()
    .use(math)

  const targetText = 'Math\n$$\n\\alpha\n$$\n'

  const ast = processor.parse(targetText)
  expect(ast.children[0].children[0].value).toEqual('Math')
  expect(ast.children[1].type).toEqual('math')
  expect(ast.children[1].children[0].value).toEqual('\\alpha')
})

it('should parse inline math between double dollars', () => {
  const processor = remark()
    .use(math)

  const targetText = '$$\\alpha$$'

  const ast = processor.parse(targetText)
  expect(ast.children[0].type).toEqual('paragraph')
  expect(ast.children[0].children.length).toEqual(1)
  expect(ast.children[0].children[0].type).toEqual('inlineMath')
})

it('should set properties to math inline/block', () => {
  const processor = remark()
    .use(math, {
      inlineProperties: {
        className: 'math-inline'
      },
      blockProperties: {
        className: 'math-block'
      }
    })

  const targetText = '$$\\alpha$$\n$$\n\\alpha\beta\n$$'

  const ast = processor.parse(targetText)
  expect(ast.children[0].type).toEqual('paragraph')
  expect(ast.children[0].children.length).toEqual(1)
  expect(ast.children[0].children[0].type).toEqual('inlineMath')
  expect(ast.children[0].children[0].data.hProperties.className).toEqual('math-inline')
  expect(ast.children[1].type).toEqual('math')
  expect(ast.children[1].data.hProperties.className).toEqual('math-block')
})
