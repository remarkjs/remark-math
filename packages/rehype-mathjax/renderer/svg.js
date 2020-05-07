const {mathjax} = require('mathjax-full/js/mathjax')
const {TeX} = require('mathjax-full/js/input/tex')
const {SVG} = require('mathjax-full/js/output/svg')
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages')
const AbstractRenderer = require('./base/node')

class SvgRenderer extends AbstractRenderer {
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

module.exports = SvgRenderer
