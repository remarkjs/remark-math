import {SVG} from 'mathjax-full/js/output/svg.js'

/**
 * @param {unknown} options
 */
export function createOutputSvg(options) {
  // @ts-expect-error: assume options work (mathjax types are not exported)
  return new SVG(options)
}
