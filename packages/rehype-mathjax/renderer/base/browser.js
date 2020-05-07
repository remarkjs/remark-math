const fromDom = require('hast-util-from-dom')
const {browserAdaptor} = require('mathjax-full/js/adaptors/browserAdaptor')
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html')

class AbstractRenderer {
  constructor() {
    this.adaptor = browserAdaptor()
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
