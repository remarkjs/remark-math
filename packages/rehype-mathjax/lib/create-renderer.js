/**
 * @import {Element, Text} from 'hast'
 * @import {LiteDocument} from 'mathjax-full/js/adaptors/lite/Document.js'
 * @import {LiteElement} from 'mathjax-full/js/adaptors/lite/Element.js'
 * @import {LiteText} from 'mathjax-full/js/adaptors/lite/Text.js'
 * @import {MathDocument} from 'mathjax-full/js/core/MathDocument.js'
 * @import {OutputJax} from 'mathjax-full/js/core/OutputJax.js'
 * @import {HTMLHandler} from 'mathjax-full/js/handlers/html/HTMLHandler.js'
 * @import {Options, Renderer} from './create-plugin.js'
 */

import {h} from 'hastscript'
import {liteAdaptor as liteAdapter} from 'mathjax-full/js/adaptors/liteAdaptor.js'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'
import {TeX} from 'mathjax-full/js/input/tex.js'
import {mathjax} from 'mathjax-full/js/mathjax.js'

/**
 * Create a renderer.
 *
 * @param {Options} options
 *   Configuration.
 * @param {OutputJax<LiteElement, LiteText, LiteDocument>} output
 *   Output jax.
 * @returns {Renderer}
 *   Rendeder.
 */
export function createRenderer(options, output) {
  const input = new TeX({packages: AllPackages, ...options.tex})
  /** @type {MathDocument<LiteElement, LiteText, LiteDocument>} */
  let document
  /** @type {HTMLHandler<LiteElement | LiteText, LiteText, LiteDocument>} */
  let handler

  return {
    register() {
      const adapter = liteAdapter()
      // To do next major: Keep resultant HTML handler from `register(adapter)` to
      // allow registering the `AssistiveMmlHandler` as in this demo:
      // <https://github.com/mathjax/MathJax-demos-node/tree/master/direct>
      /* eslint-disable-next-line new-cap */
      handler = RegisterHTMLHandler(adapter)
      document = mathjax.document('', {InputJax: input, OutputJax: output})
    },
    render(value, options) {
      // Cast as this practically results in an element instead of an `MmlNode`.
      const liteElement = /** @type {LiteElement} */ (
        document.convert(value, options)
      )
      return [fromLiteElement(liteElement)]
    },
    styleSheet() {
      const node = fromLiteElement(output.styleSheet(document))
      // Do not render the `id` that mathjax suggests.
      node.properties.id = undefined
      return node
    },
    unregister() {
      mathjax.handlers.unregister(handler)
    }
  }
}

/**
 * @param {LiteElement} liteElement
 * @returns {Element}
 */
function fromLiteElement(liteElement) {
  /** @type {Array<Element | Text>} */
  const children = []

  for (const node of liteElement.children) {
    children.push(
      'value' in node
        ? {type: 'text', value: node.value}
        : fromLiteElement(node)
    )
  }

  return h(liteElement.kind, liteElement.attributes, children)
}
