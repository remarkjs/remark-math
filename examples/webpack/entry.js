const unified = require('unified')
const parse = require('remark-parse')
const html = require('remark-html')
const math = require('../../index')
const katex = require('katex')

require('katex/dist/katex.css')
require('github-markdown-css')

function remark () {
  return unified()
    .use(parse)
}

const opts = {
  katex,
  inlineProperties: {
    class: 'math-inline'
  },
  blockProperties: {
    class: 'math-block'
  }
}

const processor = remark()
  .use(math, opts)
  .use(html)

// Bind render method to window
window.renderMarkdown = function renderMarkdown (rawString) {
  return processor.process(rawString).toString()
}
