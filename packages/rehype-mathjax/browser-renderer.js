const fromDom = require('hast-util-from-dom')
const {mathjax} = require('mathjax-full/js/mathjax')
const {TeX} = require('mathjax-full/js/input/tex')
const {SVG} = require('mathjax-full/js/output/svg')
const {CHTML} = require('mathjax-full/js/output/chtml')
const {browserAdaptor} = require('mathjax-full/js/adaptors/browserAdaptor')
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html')
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages')

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

class SVGRenderer extends AbstractRenderer {
  constructor(options) {
    super()
    this.InputJax = new TeX({packages: AllPackages})
    this.OutputJax = new SVG(options)
    this.mathDocument = mathjax.document('', {
      InputJax: this.InputJax,
      OutputJax: this.OutputJax
    })
  }
}

class CHTMLRenderer extends AbstractRenderer {
  constructor(options) {
    super()
    this.InputJax = new TeX({packages: AllPackages})
    this.OutputJax = new CHTML(options)
    this.mathDocument = mathjax.document('', {
      InputJax: this.InputJax,
      OutputJax: this.OutputJax
    })
  }
}

exports.SVGRenderer = SVGRenderer
exports.CHTMLRenderer = CHTMLRenderer
