const unified = require('unified')
const parse = require('remark-parse')
const math = require('../../packages/remark-math')
const remark2rehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')
const rehypeKatex = require('../../packages/rehype-katex')

/**
 * Usage via rehype(Recommended by wooorm)
 * Raw String => MDAST => HAST => transformed HAST => HTML
 */
const processor = unified()
  .use(parse)
  .use(math)
  .use(remark2rehype)
  .use(rehypeKatex)
  .use(rehypeStringify)

/**
 * Usage via remark-html
 * Raw String => MDAST => transformed MDAST => HTML
 */
// const remarkHtmlKatex = require('../../packages/remark-html-katex')
// const html = require('remark-html')
// const processor = unified()
//   .use(parse)
//   .use(math)
//   .use(remarkHtmlKatex)
//   .use(html)

// https://en.wikipedia.org/wiki/Lift_(force)#Lift_coefficient
const rawString = `Lift($L$) can be determined by Lift Coeeficient ($C_L$) like the following equation.

$$
L = \\frac{1}{2} \\rho v^2 S C_L
$$
`

// Raw string => AST
const parsedAST = processor.parse(rawString)
// Transform(tex code to hast by KaTeX)
const transformedAST = processor.runSync(parsedAST)
// AST => HTML string
const renderedString = processor.stringify(transformedAST)

// Or you can directly process the markdown string
// const renderedString = processor.processSync(rawString).toString()

console.log(renderedString)
