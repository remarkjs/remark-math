/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mathjax-full/js/core/OutputJax').OutputJax<HTMLElement, Text, Document>} OutputJax
 * @typedef {import('mathjax-full/js/core/MathDocument.js').MathDocument<HTMLElement, Text, Document>} MathDocument
 * @typedef {import('mathjax-full/js/input/tex.js').TeX<HTMLElement, Text, Document>} TeX_
 * @typedef {import('./create-plugin.js').Options} Options
 * @typedef {import('./create-plugin.js').Renderer} Renderer
 */

import {mathjax} from 'mathjax-full/js/mathjax.js'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
import {TeX} from 'mathjax-full/js/input/tex.js'
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js'
import {fromDom} from 'hast-util-from-dom'
import {toText} from 'hast-util-to-text'
import {createAdaptor} from './create-adaptor.js'

const adaptor = createAdaptor()

// To do next major: Keep resultant HTML handler from `register(adaptor)` to
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
RegisterHTMLHandler(adaptor)

/**
 * @param {Options} options
 * @param {OutputJax} output
 * @returns {Renderer}
 */
export function createRenderer(options, output) {
  const input = new TeX(Object.assign({packages: AllPackages}, options.tex))
  /** @type {MathDocument} */
  const doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {
    render(node, options) {
      const domNode = fromDom(
        // @ts-expect-error: assume mathml nodes can be handled by
        // `hast-util-from-dom`.
        doc.convert(toText(node, {whitespace: 'pre'}), options)
      )
      // @ts-expect-error: `fromDom` returns an element for a given element.
      node.children = [domNode]
    },
    styleSheet() {
      const value = adaptor.textContent(output.styleSheet(doc))

      return {
        type: 'element',
        tagName: 'style',
        properties: {},
        children: [{type: 'text', value}]
      }
    }
  }
}
