/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('./lib/create-plugin').SvgOptions} Options
 */

import {createOutputSvg} from './lib/create-output-svg.js'
import {createRenderer} from './lib/create-renderer.js'
import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxSvg =
  /** @type {import('unified').Plugin<[Options?]|void[], Root>} */
  (
    createPlugin((inputOptions, outputOptions) =>
      createRenderer(inputOptions, createOutputSvg(outputOptions))
    )
  )

export default rehypeMathJaxSvg
