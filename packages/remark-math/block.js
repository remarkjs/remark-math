const trim = require('trim-trailing-lines')
const util = require('./util')

module.exports = mathBlock

const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '
const C_DOLLAR = '$'

const MIN_FENCE_COUNT = 2
const CODE_INDENT_COUNT = 4

function mathBlock() {
  const parser = this.Parser
  const compiler = this.Compiler

  if (util.isRemarkParser(parser)) {
    attachParser(parser)
  }

  if (util.isRemarkCompiler(compiler)) {
    attachCompiler(compiler)
  }
}

function attachParser(parser) {
  const proto = parser.prototype
  const blockMethods = proto.blockMethods
  const interruptParagraph = proto.interruptParagraph
  const interruptList = proto.interruptList
  const interruptBlockquote = proto.interruptBlockquote

  proto.blockTokenizers.math = mathBlockTokenizer

  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'math')

  // Inject math to interrupt rules
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, [
    'math'
  ])
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['math'])
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, [
    'math'
  ])

  function mathBlockTokenizer(eat, value, silent) {
    var length = value.length + 1
    var index = 0
    var subvalue = ''
    var fenceCount
    var marker
    var character
    var queue
    var content
    var exdentedContent
    var closing
    var exdentedClosing
    var indent
    var now

    /* Eat initial spacing. */
    while (index < length) {
      character = value.charAt(index)

      if (character !== C_SPACE && character !== C_TAB) {
        break
      }

      subvalue += character
      index++
    }

    indent = index

    /* Eat the fence. */
    character = value.charAt(index)

    if (character !== C_DOLLAR) {
      return
    }

    index++
    marker = character
    fenceCount = 1
    subvalue += character

    while (index < length) {
      character = value.charAt(index)

      if (character !== marker) {
        break
      }

      subvalue += character
      fenceCount++
      index++
    }

    if (fenceCount < MIN_FENCE_COUNT) {
      return
    }

    /* Eat everything after the fence. */
    while (index < length) {
      character = value.charAt(index)

      if (character === C_NEWLINE) {
        break
      }

      if (character === C_DOLLAR) {
        return
      }

      subvalue += character
      index++
    }

    character = value.charAt(index)

    if (silent) {
      return true
    }

    now = eat.now()
    now.column += subvalue.length
    now.offset += subvalue.length

    queue = ''
    closing = ''
    exdentedClosing = ''
    content = ''
    exdentedContent = ''

    /* Eat content. */
    while (index < length) {
      character = value.charAt(index)
      content += closing
      exdentedContent += exdentedClosing
      closing = ''
      exdentedClosing = ''

      if (character !== C_NEWLINE) {
        content += character
        exdentedClosing += character
        index++
        continue
      }

      /* Add the newline to `subvalue` if its the first
       * character.  Otherwise, add it to the `closing`
       * queue. */
      if (content) {
        closing += character
        exdentedClosing += character
      } else {
        subvalue += character
      }

      queue = ''
      index++

      while (index < length) {
        character = value.charAt(index)

        if (character !== C_SPACE) {
          break
        }

        queue += character
        index++
      }

      closing += queue
      exdentedClosing += queue.slice(indent)

      if (queue.length >= CODE_INDENT_COUNT) {
        continue
      }

      queue = ''

      while (index < length) {
        character = value.charAt(index)

        if (character !== marker) {
          break
        }

        queue += character
        index++
      }

      closing += queue
      exdentedClosing += queue

      if (queue.length < fenceCount) {
        continue
      }

      queue = ''

      while (index < length) {
        character = value.charAt(index)

        if (character === C_NEWLINE) {
          break
        }

        closing += character
        exdentedClosing += character
        index++
      }

      break
    }

    subvalue += content + closing
    const trimmedContent = trim(exdentedContent)
    return eat(subvalue)({
      type: 'math',
      value: trimmedContent,
      data: {
        hName: 'div',
        hProperties: {className: ['math']},
        hChildren: [{type: 'text', value: trimmedContent}]
      }
    })
  }
}

function attachCompiler(compiler) {
  const proto = compiler.prototype

  proto.visitors.math = compileBlockMath

  function compileBlockMath(node) {
    return '$$\n' + node.value + '\n$$'
  }
}
