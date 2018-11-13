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

module.exports = function plugin (opts) {
  if (opts == null) opts = {}
  if (opts.throwOnError == null) opts.throwOnError = false
  return function transform (node, file) {
    function renderContent (element) {
      let renderedValue
      const isMath = element.type === 'math'
      try {
        renderedValue = katex.renderToString(element.value, {
          displayMode: isMath
        })
      } catch (err) {
        if (opts.throwOnError) {
          throw err
        } else {
          file.message(
            err.message,
            position.start(element)
          )

          try {
            renderedValue = katex.renderToString(element.value, {
              displayMode: isMath,
              throwOnError: false,
              errorColor: opts.errorColor
            })
          } catch (err) {
            renderedValue = '<code class="katex" style="color: ' + opts.errorColor + '">' + element.value + '</code>'
          }
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
