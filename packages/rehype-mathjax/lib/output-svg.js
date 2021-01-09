const Svg = require('mathjax-full/js/output/svg').SVG

module.exports = createOutput

function createOutput(options) {
  let settings = options || {}
  if ('tex' in settings) {
    settings = {...options}
    delete settings.tex
  }

  return new Svg(settings)
}
