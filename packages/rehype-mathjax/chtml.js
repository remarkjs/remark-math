/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('./lib/create-plugin').CHtmlOptions} Options
 */

import {createOutputChtml} from './lib/create-output-chtml.js'
import {createRenderer} from './lib/create-renderer.js'
import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxCHtml =
  /** @type {import('unified').Plugin<[Options?]|void[], Root>} */
  (
    createPlugin(
      (inputOptions, outputOptions) =>
        createRenderer(inputOptions, createOutputChtml(outputOptions)),
      true
    )
  )

export default rehypeMathJaxCHtml
