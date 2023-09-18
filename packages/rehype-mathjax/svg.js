/**
 * @typedef {import('./lib/create-plugin.js').Options} Options
 */

import {SVG} from 'mathjax-full/js/output/svg.js'
import {createPlugin} from './lib/create-plugin.js'
import {createRenderer} from './lib/create-renderer.js'

const rehypeMathJaxSvg = createPlugin(function (options) {
  // `mathjax-types` do not allow `null`.
  return createRenderer(options, new SVG(options.svg || undefined))
})

export default rehypeMathJaxSvg
