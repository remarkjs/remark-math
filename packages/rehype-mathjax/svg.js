import {createInput} from './lib/create-input.js'
import {createOutputSvg} from './lib/create-output-svg.js'
import {createRenderer} from './lib/create-renderer.js'
import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxSvg = createPlugin('rehypeMathJaxSvg', renderSvg)

export default rehypeMathJaxSvg

function renderSvg(inputOptions, outputOptions) {
  return createRenderer(
    createInput(inputOptions),
    createOutputSvg(outputOptions)
  )
}
