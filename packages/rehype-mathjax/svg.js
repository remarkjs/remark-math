/**
 * @typedef {import('./lib/create-plugin.js').Options} Options
 */

import {SVG} from 'mathjax-full/js/output/svg.js'
import {createRenderer} from './lib/create-renderer.js'
import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxSvg = createPlugin((options) =>
  createRenderer(options, new SVG(options.svg))
)

export default rehypeMathJaxSvg
