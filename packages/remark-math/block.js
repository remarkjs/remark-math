var trim = require('trim-trailing-lines')

var C_NEWLINE = '\n'
var C_TAB = '\t'
var C_SPACE = ' '
var C_DOLLAR = '$'

var MIN_FENCE_COUNT = 2
var CODE_INDENT_COUNT = 4

module.exports = function blockPlugin (p, opts = {}) {
  const Parser = p.Parser

  function blockTokenizer (eat, value, silent) {
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

    /* Eat spacing before flag. */
    while (index < length) {
      character = value.charAt(index)

      if (character !== C_SPACE && character !== C_TAB) {
        break
      }

      subvalue += character
      index++
    }

    character = value.charAt(index)

    if (character && character !== C_NEWLINE) {
      return
    }

    if (silent) {
      return true
    }

    now = eat.now()
    now.column += subvalue.length
    now.offset += subvalue.length

    if (queue) {
      subvalue += queue
    }

    queue = closing = exdentedClosing = content = exdentedContent = ''

    /* Eat content. */
    while (index < length) {
      character = value.charAt(index)
      content += closing
      exdentedContent += exdentedClosing
      closing = exdentedClosing = ''

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

        if (character !== C_SPACE && character !== C_TAB) {
          break
        }

        closing += character
        exdentedClosing += character
        index++
      }

      if (!character || character === C_NEWLINE) {
        break
      }
    }

    subvalue += content + closing
    const trimmedValue = trim(exdentedContent)
    let hChildren = [{
      type: 'text',
      value: trimmedValue
    }]
    if (opts.katex != null) {
      console.warn('Using options.katex has been deprecated.')
    }
    return eat(subvalue)({
      type: 'math',
      children: [
        {
          type: 'text',
          value: trimmedValue
        }
      ],
      data: {
        hName: 'div',
        hChildren: hChildren,
        hProperties: opts.blockProperties
      }
    })
  }
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  const interruptParagraph = Parser.prototype.interruptParagraph
  const interruptList = Parser.prototype.interruptList
  const interruptBlockquote = Parser.prototype.interruptBlockquote
  blockTokenizers.math = blockTokenizer
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'math')
  interruptParagraph.splice(interruptParagraph.indexOf('fencedCode') + 1, 0, ['math'])
  interruptList.splice(interruptList.indexOf('fencedCode') + 1, 0, ['math'])
  interruptBlockquote.splice(interruptBlockquote.indexOf('fencedCode') + 1, 0, ['math'])

  if (p.Compiler != null) {
    const visitors = p.Compiler.prototype.visitors
    visitors.math = function (node) {
      return '$$\n' + node.children[0].value + '\n$$'
    }
  }
}
