const math = require('../packages/remark-math')
const unified = require('unified')
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const u = require('unist-builder')

function remark () {
  return unified()
    .use(parse, {position: false})
    .use(stringify)
}

it('should parse a math inline and a math block ', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    'Math $\\alpha$',
    '',
    '$$',
    '\\beta+\\gamma',
    '$$'
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('paragraph', [
      u('text', 'Math '),
      u('inlineMath', '\\alpha')
    ]),
    u('math', '\\beta+\\gamma')
  ]))
})

it('should escape a dollar with back slash', () => {
  const processor = remark()
    .use(math)

  const targetText = '\\$\\alpha\\$'

  const ast = processor.parse(targetText)
  expect(ast).toMatchObject(u('root', [
    u('paragraph', [
      u('text', '$'),
      u('text', '\\alpha'),
      u('text', '$')
    ])
  ]))
})

it('should NOT escape a dollar with double backslashes', () => {
  const processor = remark()
    .use(math)

  const targetText = '\\\\$\\alpha$'

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('paragraph', [
      u('text', '\\'),
      u('inlineMath', '\\alpha')
    ])
  ]))
})

it('should render a super factorial to a math block', () => {
  const processor = remark()
    .use(math)

  const targetText = '$\\alpha\\$$'

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('paragraph', [
      u('inlineMath', '\\alpha\\$')
    ])
  ]))
})

it('should render super factorial to a math inline', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '$$',
    '\\alpha\\$',
    '$$'
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('math', '\\alpha\\$')
  ]))
})

it('should render a math block just after a pragraph', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    'tango',
    '$$',
    '\\alpha',
    '$$'
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('paragraph', [u('text', 'tango')]),
    u('math', '\\alpha')
  ]))
})

it('should parse inline math between double dollars', () => {
  const processor = remark()
    .use(math)

  const targetText = '$$\\alpha$$'

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('paragraph', [
      u('inlineMath', '\\alpha')
    ])
  ]))
})

it('should stringify', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '$$\\alpha$$',
    '$$',
    '\\alpha\\beta',
    '$$'
  ].join('\n')

  const result = processor.processSync(targetText).toString()

  expect(result).toEqual([
    '$\\alpha$',
    '',
    '$$',
    '\\alpha\\beta',
    '$$',
    ''
  ].join('\n'))
})

it('should stringify math block child of blockquote', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '> $$',
    '> \\alpha\\beta',
    '> $$'
  ].join('\n')

  const result = processor.processSync(targetText).toString()

  expect(result).toEqual([
    '> $$',
    '> \\alpha\\beta',
    '> $$',
    ''
  ].join('\n'))
})

it('should parse math block with indent', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '  $$$',
    '    \\alpha',
    '  $$$'
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('math', '  \\alpha')
  ]))
})

it('should ignore everything just after opening/closing marker', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '$$  should',
    '\\alpha',
    '$$  be ignored',
    ''
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('math', '\\alpha')
  ]))
})

it('should not affect next block', () => {
  const processor = remark()
    .use(math)

  const targetText = [
    '$$',
    '\\alpha',
    '$$',
    '```',
    'code fence',
    '```'
  ].join('\n')

  const ast = processor.parse(targetText)

  expect(ast).toMatchObject(u('root', [
    u('math', '\\alpha'),
    u('code', 'code fence')
  ]))
})
