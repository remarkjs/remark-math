const mathjax = require('mathjax-full/js/mathjax').mathjax
const register = require('mathjax-full/js/handlers/html').RegisterHTMLHandler
const fromDom = require('hast-util-from-dom')
const createAdaptor = require('./adaptor')

module.exports = renderer

function renderer(input, output) {
  var adaptor = createAdaptor()
  register(adaptor)
  var doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {render: render, styleSheet: styleSheet}

  function render(value, options) {
    return fromDom(doc.convert(value, options))
  }

  function styleSheet() {
    var value = adaptor.textContent(output.styleSheet(doc))

    return {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [{type: 'text', value: value}]
    }
  }
}
