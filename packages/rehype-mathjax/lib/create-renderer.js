/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mathjax-full/js/core/OutputJax').OutputJax<any, any, any>} OutputJax
 * @typedef {import('./create-plugin.js').CreateRenderer} CreateRenderer
 *
 * For some reason MathJax types can’t be imported.
 */

import {mathjax} from 'mathjax-full/js/mathjax.js'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
import {fromDom} from 'hast-util-from-dom'
import {toText} from 'hast-util-to-text'
import {createInput} from './create-input.js'
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
 * @type {CreateRenderer}
 * @param {OutputJax} output
 */
export function createRenderer(inputOptions, output) {
  const input = createInput(inputOptions)
  const doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {
    render(node, options) {
      const domNode = doc.convert(toText(node), options)
      // @ts-expect-error: assume no `doctypes`
      node.children = [fromDom(domNode)]
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
