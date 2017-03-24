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
    visit(node, 'element', function (element) {
      const isInlineMath = element.tagName === 'span' &&
        element.properties.className &&
        element.properties.className.includes('inlineMath')
      const isMath = element.tagName === 'div' && element.properties.className === 'math'

      if (isInlineMath || isMath) {
        let renderedValue
        try {
          renderedValue = katex.renderToString(element.children[0].value, {
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
            renderedValue = katex.renderToString(element.children[0].value, {
              displayMode: isMath,
              throwOnError: false,
              errorColor: opts.errorColor
            }, 'katex-parse-error')
          }
        }

        const inlineMathAst = parseMathHtml(renderedValue).children[0]

        Object.assign(element.properties, {className: element.properties.className})
        element.children = [inlineMathAst]
      }
    })
    return node
  }
}
