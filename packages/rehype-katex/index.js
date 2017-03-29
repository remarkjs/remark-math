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

function hasClass (element, className) {
  return element.properties.className && element.properties.className.includes(className)
}

function isTag (element, tag) {
  return element.tagName === tag
}

module.exports = function plugin (opts = {}) {
  if (opts.throwOnError == null) opts.throwOnError = false
  return function transform (node, file) {
    visit(node, 'element', function (element) {
      const isInlineMath = isTag(element, 'span') && hasClass(element, 'inlineMath')
      const isMath = (opts.inlineDoubleDisplay && hasClass(element, 'inlineMathDouble')) ||
        (isTag(element, 'div') && hasClass(element, 'math'))

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
