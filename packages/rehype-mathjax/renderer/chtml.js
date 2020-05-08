var createInput = require('./input')
var createOutput = require('./output-chtml')
var renderer = require('./renderer')

module.exports = renderCHtml

function renderCHtml(options) {
  return renderer(createInput(), createOutput(options))
}
