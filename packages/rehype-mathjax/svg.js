import {createInput} from './lib/input.js'
import {createOutput} from './lib/output-svg.js'
import {createRenderer} from './lib/renderer.js'
import {createPlugin} from './lib/core.js'

const rehypeMathJaxSvg = createPlugin('rehypeMathJaxSvg', renderSvg)

export default rehypeMathJaxSvg

function renderSvg(inputOptions, outputOptions) {
  return createRenderer(createInput(inputOptions), createOutput(outputOptions))
}
