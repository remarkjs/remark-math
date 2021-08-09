/**
 * @typedef {import('mathjax-full/js/util/Options.js').OptionList} OptionList
 * @typedef {import('mathjax-full/js/output/chtml.js').CHTML<HTMLElement, Text, Document>} CHTML_
 */

import {CHTML} from 'mathjax-full/js/output/chtml.js'

/**
 * @param {OptionList} options
 * @returns {CHTML_}
 */
export function createOutputChtml(options) {
  return new CHTML(options)
}
