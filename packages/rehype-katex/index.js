const visit = require('unist-util-visit')
const katex = require('katex')
const unified = require('unified')
const parse = require('rehype-parse')
const position = require('unist-util-position')

module.exports = plugin

function parseMathHtml(html) {
  return unified()
    .use(parse, {fragment: true, position: false})
    .parse(html)
}

function hasClass(element, className) {
  return (
    element.properties.className &&
    element.properties.className.includes(className)
  )
}

function isTag(element, tag) {
  return element.tagName === tag
}

function plugin(opts) {
  if (opts == null) opts = {}
  if (opts.throwOnError == null) opts.throwOnError = false
  if (opts.errorColor == null) opts.errorColor = '#cc0000'
  if (opts.macros == null) opts.macros = {}
  return transform

  function transform(node, file) {
    visit(node, 'element', function(element) {
      const isInlineMath =
        isTag(element, 'span') && hasClass(element, 'inlineMath')
      const isMath =
        (opts.inlineMathDoubleDisplay &&
          hasClass(element, 'inlineMathDouble')) ||
        (isTag(element, 'div') && hasClass(element, 'math'))

      if (isInlineMath || isMath) {
        let renderedValue
        try {
          renderedValue = katex.renderToString(element.children[0].value, {
            displayMode: isMath,
            macros: opts.macros,
            strict: opts.strict
          })
        } catch (error) {
          if (opts.throwOnError) {
            throw error
          } else {
            file.message(error.message, position.start(element))

            renderedValue = katex.renderToString(element.children[0].value, {
              displayMode: isMath,
              macros: opts.macros,
              throwOnError: false,
              errorColor: opts.errorColor,
              strict: 'ignore'
            })
          }
        }

        const inlineMathAst = parseMathHtml(renderedValue).children[0]

        Object.assign(element.properties, {
          className: element.properties.className
        })

        element.children = [inlineMathAst]
      }
    })
    return node
  }
}
