const visit = require('unist-util-visit')
const katex = require('katex')
const unified = require('unified')
const parse = require('rehype-parse')

function parseMathHtml (html) {
  return unified()
    .use(parse, {
      fragment: true,
      position: false
    })
    .parse(html)
}

module.exports = function plugin (opts = {}) {
  if (opts.throwOnError == null) opts.throwOnError = false
  return function transform (node, file) {
    visit(node, 'element', function (element) {
      if (element.tagName === 'span' && element.properties.className === 'inlineMath') {
        let renderedValue
        try {
          renderedValue = katex.renderToString(element.children[0].value)
        } catch (err) {
          if (opts.throwOnError) {
            throw err
          } else {

          }
        }

        const inlineMathAst = parseMathHtml(renderedValue).children[0]

        Object.assign(element.properties, {className: 'inlineMath'})
        element.children = [inlineMathAst]
      }

      if (element.tagName === 'div' && element.properties.className === 'blockMath') {
        let renderedValue
        try {
          renderedValue = katex.renderToString(element.children[0].value, {
            displayMode: true
          })
        } catch (err) {
          if (opts.throwOnError) {
            throw err
          } else {

          }
        }
        const mathAst = parseMathHtml(renderedValue).children[0]
        Object.assign(element.properties, {className: 'math'})
        element.children = [mathAst]
      }
    })
    return node
  }
}
