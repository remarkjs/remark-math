import {CHTML as Chtml} from 'mathjax-full/js/output/chtml.js'
import {createPlugin} from './create-plugin.js'
import {createRenderer} from './create-renderer.js'

/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with MathJax using CHTML.
 *
 * @param options
 *   Configuration (`options.chtml.fontURL` is required).
 * @returns
 *   Transform.
 */
const rehypeMathJaxChtml = createPlugin(function (options) {
  if (!options.chtml || !options.chtml.fontURL) {
    throw new Error(
      'rehype-mathjax: missing `fontURL` in options, which must be set to a URL to reach MathJaX fonts'
    )
  }

  return createRenderer(options, new Chtml(options.chtml))
})

export default rehypeMathJaxChtml
