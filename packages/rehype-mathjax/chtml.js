import {createInput} from './lib/input.js'
import {createOutput} from './lib/output-chtml.js'
import {createRenderer} from './lib/renderer.js'
import {createPlugin} from './lib/core.js'

const rehypeMathJaxCHtml = createPlugin('rehypeMathJaxCHtml', renderCHtml, true)

export default rehypeMathJaxCHtml

function renderCHtml(inputOptions, outputOptions) {
  return createRenderer(createInput(inputOptions), createOutput(outputOptions))
}
