const fromDom = require('hast-util-from-dom')
const {JSDOM} = require('jsdom')
const {mathjax} = require('mathjax-full/js/mathjax')
const {TeX} = require('mathjax-full/js/input/tex')
const {SVG} = require('mathjax-full/js/output/svg')
const {jsdomAdaptor} = require('mathjax-full/js/adaptors/jsdomAdaptor')
const {RegisterHTMLHandler} = require('mathjax-full/js/handlers/html')
const {AllPackages} = require('mathjax-full/js/input/tex/AllPackages')

exports.styleSheet = styleSheet
exports.render = render

const adaptor = jsdomAdaptor(JSDOM)
RegisterHTMLHandler(adaptor)
const tex = new TeX({packages: AllPackages})
const svg = new SVG({fontCache: 'none'})
const mathDocument = mathjax.document('', {InputJax: tex, OutputJax: svg})

function styleSheet() {
  return {
    type: 'element',
    tagName: 'style',
    properties: {},
    children: [
      {type: 'text', value: adaptor.textContent(svg.styleSheet(mathDocument))}
    ]
  }
}

function render(math, options) {
  return fromDom(mathDocument.convert(math, options))
}
