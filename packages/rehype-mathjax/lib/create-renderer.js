/**
 * @import {Element} from 'hast'
 * @import {MathDocument} from 'mathjax-full/js/core/MathDocument.js'
 * @import {OutputJax} from 'mathjax-full/js/core/OutputJax.js'
 * @import {Options, Renderer} from './create-plugin.js'
 */

import {fromDom} from 'hast-util-from-dom'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
import {TeX} from 'mathjax-full/js/input/tex.js'
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'
import {mathjax} from 'mathjax-full/js/mathjax.js'
import {createAdapter} from '#create-adapter'

const adapter = createAdapter()

// To do next major: Keep resultant HTML handler from `register(adapter)` to
// allow registering the `AssistiveMmlHandler` as in this demo:
// <https://github.com/mathjax/MathJax-demos-node/tree/master/direct>
//
// To do next major: If registering `AssistiveMmlHandler` is supported through
// configuration, move HTML handler registration to beginning of transformer and
// unregister at the end of transformer with
// `mathjax.handlers.unregister(handler)`.
// That is to prevent memory leak in `mathjax.handlers` whenever a new instance
// of the plugin is used.
/* eslint-disable-next-line new-cap */
RegisterHTMLHandler(adapter)

/**
 * Create a renderer.
 *
 * @param {Options} options
 *   Configuration.
 * @param {OutputJax<HTMLElement, Text, Document>} output
 *   Output jax.
 * @returns {Renderer}
 *   Rendeder.
 */
export function createRenderer(options, output) {
  const input = new TeX({packages: AllPackages, ...options.tex})
  /** @type {MathDocument<HTMLElement, Text, Document>} */
  const document = mathjax.document('', {InputJax: input, OutputJax: output})

  return {
    render(value, options) {
      // Cast as this practically results in `HTMLElement`.
      const domNode = /** @type {HTMLElement} */ (
        document.convert(value, options)
      )
      // Cast as `HTMLElement` results in an `Element`.
      const hastNode = /** @type {Element} */ (fromDom(domNode))
      return [hastNode]
    },
    styleSheet() {
      const value = adapter.textContent(output.styleSheet(document))

      return {
        type: 'element',
        tagName: 'style',
        properties: {},
        children: [{type: 'text', value}]
      }
    }
  }
}
