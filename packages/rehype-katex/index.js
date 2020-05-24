const visit = require('unist-util-visit')
const katex = require('katex').renderToString
const unified = require('unified')
const parse = require('rehype-parse')
const toText = require('hast-util-to-text')

module.exports = rehypeKatex

const assign = Object.assign

const parseHtml = unified().use(parse, {fragment: true, position: false})

const source = 'rehype-katex'

function rehypeKatex(options) {
  const settings = options || {}
  const throwOnError = settings.throwOnError || false

  return transformMath

  function transformMath(tree, file) {
    
    let macros = {};
    
    visit(tree, 'element', onelement)

    function onelement(element) {
      const classes = element.properties.className || []
      const inline = classes.includes('math-inline')
      const displayMode = classes.includes('math-display')

      if (!inline && !displayMode) {
        return
      }

      const value = toText(element)

      let result

      try {
        result = katex(
          value,
          assign({}, settings, {
            displayMode: displayMode,
            throwOnError: true,
            macros
          })
        )
      } catch (error) {
        const fn = throwOnError ? 'fail' : 'message'
        const origin = [source, error.name.toLowerCase()].join(':')

        file[fn](error.message, element.position, origin)

        result = katex(
          value,
          assign({}, settings, {
            displayMode: displayMode,
            throwOnError: false,
            strict: 'ignore',
            macros
          })
        )
      }

      element.children = parseHtml.parse(result).children
    }
  }
}
