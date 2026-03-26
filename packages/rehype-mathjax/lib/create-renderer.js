/**
 * @import {Element, Text} from 'hast'
 * @import {LiteDocument} from '@mathjax/src/js/adaptors/lite/Document.js'
 * @import {LiteElement} from '@mathjax/src/js/adaptors/lite/Element.js'
 * @import {LiteText} from '@mathjax/src/js/adaptors/lite/Text.js'
 * @import {MathDocument} from '@mathjax/src/js/core/MathDocument.js'
 * @import {OutputJax} from '@mathjax/src/js/core/OutputJax.js'
 * @import {HTMLHandler as HtmlHandler} from '@mathjax/src/js/handlers/html/HTMLHandler.js'
 * @import {Options, Renderer} from './create-plugin.js'
 */

import {h} from 'hastscript'
import {liteAdaptor as liteAdapter} from '@mathjax/src/js/adaptors/liteAdaptor.js'
import {RegisterHTMLHandler as registerHtmlHandler} from '@mathjax/src/js/handlers/html.js'
import {TeX as Tex} from '@mathjax/src/js/input/tex.js'
import {mathjax} from '@mathjax/src/js/mathjax.js'
import {allPackages} from './tex-packages.js'
// No-op async loader: all font data is pre-loaded via static imports
// in the entry points (svg.js, chtml.js). This prevents MathJax from
// attempting dynamic loading at runtime.
mathjax.asyncLoad = () => Promise.resolve()

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
  const input = new Tex({packages: allPackages, ...options.tex})
  /** @type {MathDocument<LiteElement, LiteText, LiteDocument>} */
  let document
  /** @type {HtmlHandler<LiteElement | LiteText, LiteText, LiteDocument>} */
  let handler

  return {
    register() {
      const adapter = liteAdapter()
      handler = registerHtmlHandler(adapter)
      document = mathjax.document('', {InputJax: input, OutputJax: output})
      // Apply pre-loaded dynamic font data to this output instance.
      // The font side-effect imports in svg.js / chtml.js registered
      // setup() functions on the font class via dynamicSetup(). We must
      // call them on each new font instance because loadDynamicFiles()
      // has a class-level `if (!df.promise)` guard that skips setup for
      // instances created after the first.
      const font = /** @type {any} */ (output).font
      if (font) {
        const dynamicFiles = font.constructor.dynamicFiles
        for (const name of Object.keys(dynamicFiles)) {
          const df = dynamicFiles[name]
          df.promise ??= Promise.resolve()
          df.setup(font)
        }
      }
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
