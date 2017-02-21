const unified = require('unified')
const parse = require('remark-parse')
const html = require('remark-html')
const math = require('../../index')
const katex = require('katex')

function remark () {
  return unified()
    .use(parse)
}

const opts = {
  katex,
  inlineProperties: {
    className: 'math-inline'
  },
  blockProperties: {
    className: 'math-block'
  }
}

const processor = remark()
  .use(math, opts)
  .use(html)

// https://en.wikipedia.org/wiki/Lift_(force)#Lift_coefficient
const rawString = `Lift($L$) can be determined by Lift Coeeficient ($C_L$) like the following equation.

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
`

// Raw string => AST
const parsedAST = processor.parse(rawString)
// AST => HTML string
const renderedString = processor.stringify(parsedAST)

// Or you can directly process the markdown string
// const renderedString = processor.process(rawString).toString()

console.log(renderedString)
