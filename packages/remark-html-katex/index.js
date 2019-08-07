const visit = require('unist-util-visit')
const katex = require('katex')
const unified = require('unified')
const parse = require('rehype-parse')
const position = require('unist-util-position')

module.exports = plugin

function parseMathHtml(html) {
  return unified()
    .use(parse, {
      fragment: true,
      position: false
    })
    .parse(html)
}

function plugin(opts) {
  if (opts == null) opts = {}
  if (opts.throwOnError == null) opts.throwOnError = false
  if (opts.errorColor == null) opts.errorColor = '#cc0000'
  if (opts.macros == null) opts.macros = {}
  return transform

  function transform(node, file) {
    function renderContent(element) {
      let renderedValue
      const isMath = element.type === 'math'
      try {
        renderedValue = katex.renderToString(element.value, {
          macros: opts.macros,
          displayMode: isMath,
          strict: opts.strict
        })
      } catch (error) {
        if (opts.throwOnError) {
          throw error
        } else {
          file.message(error.message, position.start(element))

          renderedValue = katex.renderToString(element.value, {
            displayMode: isMath,
            macros: opts.macros,
            throwOnError: false,
            errorColor: opts.errorColor,
            strict: 'ignore'
          })
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
