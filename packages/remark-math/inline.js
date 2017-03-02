function locator (value, fromIndex) {
  return value.indexOf('$', fromIndex)
}

const ESCAPED_INLINE_MATH = /^\\\$/
const INLINE_MATH = /^\$((?:\\\$|[^$])+)\$/
const INLINE_MATH_DOUBLE = /^\$\$((?:\\\$|[^$])+)\$\$/

module.exports = function inlinePlugin (opts = {}) {
  // This warning will be removed after v1.0
  if (opts.katex != null) {
    console.warn('Using options.katex has been deprecated.\nPlease use remark-math-katex.')
  }

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

      return eat(match[0])({
        type: 'inlineMath',
        value: match[1].trim()
      })
    }
  }
  inlineTokenizer.locator = locator

  const Parser = this.Parser

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers
  const inlineMethods = Parser.prototype.inlineMethods
  inlineTokenizers.math = inlineTokenizer
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math')

  const Compiler = this.Compiler

  // Stringify for math inline
  if (Compiler != null) {
    const visitors = Compiler.prototype.visitors
    visitors.inlineMath = function (node) {
      return '$' + node.value + '$'
    }
  }
}
