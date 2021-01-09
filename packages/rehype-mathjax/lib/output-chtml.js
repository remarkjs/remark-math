const CHtml = require('mathjax-full/js/output/chtml').CHTML

module.exports = createOutput

function createOutput(options) {
  if (!options || !options.fontURL) {
    throw new Error(
      'rehype-mathjax: missing `fontURL` in options, which must be set to a URL to reach MathJaX fonts'
    )
  }

  let settings = options
  if ('tex' in settings) {
    settings = {...options}
    delete settings.tex
  }

  return new CHtml(settings)
}
