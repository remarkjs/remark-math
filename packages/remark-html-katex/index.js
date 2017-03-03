const visit = require('unist-util-visit')
const katex = require('katex')
const unified = require('unified')
const parse = require('rehype-parse')
const position = require('unist-util-position')

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
    function renderContent (element) {
      let renderedValue
      try {
        renderedValue = katex.renderToString(element.value, {
          displayMode: element.type === 'math'
        })
      } catch (err) {
        if (opts.throwOnError) {
          throw err
        } else {
          file.message(
            err.message,
            position.start(element)
          )
          renderedValue = katex.renderToString(element.value, {
            displayMode: element.type === 'math',
            throwOnError: false,
            errorColor: opts.errorColor
          }, 'katex-parse-error')
        }
      }

      const childAst = parseMathHtml(renderedValue).children[0]
      element.data.hChildren = [childAst]
    }

    visit(node, 'inlineMath', renderContent)
    visit(node, 'math', renderContent)

    return node
  }
}
