/**
 * @typedef {import('mathjax-full/js/util/Options.js').OptionList} OptionList
 * @typedef {import('mathjax-full/js/input/tex.js').TeX<HTMLElement, Text, Document>} TeX_
 */

import {TeX} from 'mathjax-full/js/input/tex.js'
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'

/**
 * @param {OptionList} options
 * @returns {TeX_}
 */
export function createInput(options) {
  return new TeX(Object.assign({packages: AllPackages}, options))
}
