var util = require('./util')

module.exports = mathInline

const ESCAPED_INLINE_MATH = /^\\\$/
const INLINE_MATH = /^\$((?:\\\$|[^$])+)\$/
const INLINE_MATH_DOUBLE = /^\$\$((?:\\\$|[^$])+)\$\$/

const doubleClassName = 'inlineMathDouble'

function mathInline(options) {
  const parser = this.Parser
  const compiler = this.Compiler

  if (util.isRemarkParser(parser)) {
    attachParser(parser, options)
  }

  if (util.isRemarkCompiler(compiler)) {
    attachCompiler(compiler, options)
  }
}

function attachParser(parser, options) {
  const proto = parser.prototype
  const inlineMethods = proto.inlineMethods

  mathInlineTokenizer.locator = locator

  proto.inlineTokenizers.math = mathInlineTokenizer

  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math')

  function locator(value, fromIndex) {
    return value.indexOf('$', fromIndex)
  }

  function mathInlineTokenizer(eat, value, silent) {
    let isDouble = true
    let match = INLINE_MATH_DOUBLE.exec(value)

    if (!match) {
      match = INLINE_MATH.exec(value)
      isDouble = false
    }

    const escaped = ESCAPED_INLINE_MATH.exec(value)

    if (escaped) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      return eat(escaped[0])({type: 'text', value: '$'})
    }

    if (value.slice(-2) === '\\$') {
      return eat(value)({type: 'text', value: value.slice(0, -2) + '$'})
    }

    if (match) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      if (
        match[0].includes('`') &&
        value.slice(match[0].length).includes('`')
      ) {
        const toEat = value.slice(0, value.indexOf('`'))
        return eat(toEat)({type: 'text', value: toEat})
      }

      const trimmedContent = match[1].trim()

      return eat(match[0])({
        type: 'inlineMath',
        value: trimmedContent,
        data: {
          hName: 'span',
          hProperties: {
            className: ['inlineMath'].concat(
              isDouble && options.inlineMathDouble ? [doubleClassName] : []
            )
          },
          hChildren: [{type: 'text', value: trimmedContent}]
        }
      })
    }
  }
}

function attachCompiler(compiler) {
  const proto = compiler.prototype

  proto.visitors.inlineMath = compileInlineMath

  function compileInlineMath(node) {
    let fence = '$'
    const classes =
      (node.data && node.data.hProperties && node.data.hProperties.className) ||
      []

    if (classes.includes(doubleClassName)) {
      fence = '$$'
    }

    return fence + node.value + fence
  }
}
