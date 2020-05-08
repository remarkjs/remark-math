const createInput = require('./renderer/input')
const createOutput = require('./renderer/output-chtml')
const createRenderer = require('./renderer/renderer')
const createPlugin = require('./renderer/create-plugin')

module.exports = createPlugin('rehypeMathJaxCHtml', renderCHtml)

function renderCHtml(options) {
  return createRenderer(createInput(), createOutput(options))
}
