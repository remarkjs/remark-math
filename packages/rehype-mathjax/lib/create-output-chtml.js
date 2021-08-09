import {CHTML} from 'mathjax-full/js/output/chtml.js'

/**
 * @param {unknown} options
 */
export function createOutputChtml(options) {
  // @ts-expect-error: assume options work (mathjax types are not exported)
  return new CHTML(options)
}
