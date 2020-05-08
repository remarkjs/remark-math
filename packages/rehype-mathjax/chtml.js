const createInput = require('./lib/input')
const createOutput = require('./lib/output-chtml')
const createRenderer = require('./lib/renderer')
const createPlugin = require('./lib/core')

module.exports = createPlugin('rehypeMathJaxCHtml', renderCHtml)

function renderCHtml(options) {
  return createRenderer(createInput(), createOutput(options))
}
