const {mathjax} = require('mathjax-full/js/mathjax')
const {TeX} = require('mathjax-full/js/input/tex')
const {CHTML} = require('mathjax-full/js/output/chtml')
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages')
const AbstractRenderer = require('./base/node')

class ChtmlRenderer extends AbstractRenderer {
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

module.exports = ChtmlRenderer
