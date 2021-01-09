const mathjax = require('mathjax-full/js/mathjax').mathjax
const register = require('mathjax-full/js/handlers/html').RegisterHTMLHandler
const fromDom = require('hast-util-from-dom')
const toText = require('hast-util-to-text')
const createAdaptor = require('./adaptor')

module.exports = renderer

const adaptor = createAdaptor()
register(adaptor)

function renderer(input, output) {
  const doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {render: render, styleSheet: styleSheet}

  function render(node, options) {
    node.children = [fromDom(doc.convert(toText(node), options))]
  }

  function styleSheet() {
    const value = adaptor.textContent(output.styleSheet(doc))

    return {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [{type: 'text', value: value}]
    }
  }
}
