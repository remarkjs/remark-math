const CHtml = require('mathjax-full/js/output/chtml').CHTML

module.exports = createOutput

function createOutput(options) {
  let settings = options
  if ('tex' in settings) {
    settings = {...options}
    delete settings.tex
  }

  return new CHtml(settings)
}
