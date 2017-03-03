const unified = require('unified')
const parse = require('remark-parse')
const math = require('../../packages/remark-math')
const remark2rehype = require('remark-rehype')
const stringify = require('rehype-stringify')
const katex = require('../../packages/rehype-katex')

require('katex/dist/katex.css')
require('github-markdown-css')

const processor = unified()
  .use(parse)
  .use(math)
  .use(remark2rehype)
  .use(katex)
  .use(stringify)

// Bind render method to window
window.renderMarkdown = function renderMarkdown (rawString) {
  return processor.processSync(rawString).toString()
}
