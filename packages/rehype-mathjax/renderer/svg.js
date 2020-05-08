var createInput = require('./input')
var createOutput = require('./output-svg')
var renderer = require('./renderer')

module.exports = renderSvg

function renderSvg(options) {
  return renderer(createInput(), createOutput(options))
}
