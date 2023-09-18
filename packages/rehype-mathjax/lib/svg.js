import {SVG} from 'mathjax-full/js/output/svg.js'
import {createPlugin} from './create-plugin.js'
import {createRenderer} from './create-renderer.js'

const rehypeMathJaxSvg = createPlugin(function (options) {
  // MathJax types do not allow `null`.
  return createRenderer(options, new SVG(options.svg || undefined))
})

export default rehypeMathJaxSvg
