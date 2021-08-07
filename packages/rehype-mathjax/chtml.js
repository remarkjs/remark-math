import {createInput} from './lib/create-input.js'
import {createOutputChtml} from './lib/create-output-chtml.js'
import {createRenderer} from './lib/create-renderer.js'
import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxCHtml = createPlugin('rehypeMathJaxCHtml', renderCHtml, true)

export default rehypeMathJaxCHtml

function renderCHtml(inputOptions, outputOptions) {
  return createRenderer(
    createInput(inputOptions),
    createOutputChtml(outputOptions)
  )
}
