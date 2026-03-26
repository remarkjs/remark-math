// CHTML font metric data — side-effect imports register metrics on the font
// class. Only math-essential files (~113 KB). See lib/svg.js for rationale.
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/accents.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/arrows.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/calligraphic.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/double-struck.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/fraktur.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/marrows.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/math.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/mshapes.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/script.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/shapes.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/symbols.js'
import '@mathjax/mathjax-newcm-font/js/chtml/dynamic/variants.js'

import {CHTML as Chtml} from '@mathjax/src/js/output/chtml.js'
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
