import {mathjax} from 'mathjax-full/js/mathjax.js'
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js'
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

export function createRenderer(input, output) {
  const doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {render, styleSheet}

  function render(node, options) {
    node.children = [fromDom(doc.convert(toText(node), options))]
  }

  function styleSheet() {
    const value = adaptor.textContent(output.styleSheet(doc))

    return {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [{type: 'text', value}]
    }
  }
}
