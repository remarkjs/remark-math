const createInput = require('./renderer/input')
const createOutput = require('./renderer/output-svg')
const createRenderer = require('./renderer/renderer')
const createPlugin = require('./renderer/create-plugin')

module.exports = createPlugin('rehypeMathJaxSvg', renderSvg)

function renderSvg(options) {
  return createRenderer(createInput(), createOutput(options))
}
