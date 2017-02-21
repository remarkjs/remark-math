const rehype = require('rehype')()

function locator (value, fromIndex) {
  return value.indexOf('$', fromIndex)
}

const ESCAPED_INLINE_MATH = /^\\\$/
const INLINE_MATH = /^\$((?:\\\$|[^$])+)\$/
const INLINE_MATH_DOUBLE = /^\$\$((?:\\\$|[^$])+)\$\$/

module.exports = function plugin (p, opts = {}) {
  const Parser = p.Parser

  function inlineTokenizer (eat, value, silent) {
    const match = INLINE_MATH_DOUBLE.exec(value) || INLINE_MATH.exec(value)
    const escaped = ESCAPED_INLINE_MATH.exec(value)
    if (escaped) {
      if (silent) {
        return true
      }
      return eat(escaped[0])({
        type: 'text',
        value: '$'
      })
    }

    if (match) {
      if (silent) {
        return true
      }

      const trimmedValue = match[1].trim()
      let hChildren = [{
        type: 'text',
        value: trimmedValue
      }]
      if (opts.katex != null) {
        hChildren = [rehype.parse(opts.katex.renderToString(trimmedValue, {throwOnError: false}), {fragment: true})]
      }

      return eat(match[0])({
        type: 'inlineMath',
        children: [
          {
            type: 'text',
            value: trimmedValue
          }
        ],
        data: {
          hName: 'span',
          hChildren: hChildren,
          hProperties: opts.inlineProperties
        }
      })
    }
  }
  inlineTokenizer.locator = locator

  // Inline math
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.math = inlineTokenizer

  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math')
}
