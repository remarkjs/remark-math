import {TeX} from 'mathjax-full/js/input/tex.js'
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'

/**
 * @param {unknown} options
 */
export function createInput(options) {
  return new TeX(Object.assign({packages: AllPackages}, options))
}
