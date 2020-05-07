const fromDom = require('hast-util-from-dom')
const {JSDOM} = require('jsdom')
const {jsdomAdaptor} = require('mathjax-full/js/adaptors/jsdomAdaptor')
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html')

class AbstractRenderer {
  constructor() {
    this.adaptor = jsdomAdaptor(JSDOM)
    RegisterHTMLHandler(this.adaptor)
  }

  get styleSheet() {
    return {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [
        {
          type: 'text',
          value: this.adaptor.textContent(
            this.OutputJax.styleSheet(this.mathDocument)
          )
        }
      ]
    }
  }

  render(latex, options) {
    return fromDom(this.mathDocument.convert(latex, options))
  }
}

module.exports = AbstractRenderer
