/**
 * @typedef {import('mathjax-full/js/util/Options.js').OptionList} OptionList
 * @typedef {import('mathjax-full/js/output/svg.js').SVG<HTMLElement, Text, Document>} SVG_
 */

import {SVG} from 'mathjax-full/js/output/svg.js'

/**
 * @param {OptionList} options
 * @returns {SVG_}
 */
export function createOutputSvg(options) {
  return new SVG(options)
}
