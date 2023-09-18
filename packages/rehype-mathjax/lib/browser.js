/**
 * @typedef {import('./create-plugin.js').InputTexOptions} InputTexOptions
 */

import {createPlugin} from './create-plugin.js'

/** @type {Readonly<InputTexOptions>} */
const emptyTexOptions = {}

const rehypeMathJaxBrowser = createPlugin(function (options) {
  const tex = options.tex || emptyTexOptions
  const display = tex.displayMath || [['\\[', '\\]']]
  const inline = tex.inlineMath || [['\\(', '\\)']]

  return {
    render(node, options) {
      const delimiters = (options.display ? display : inline)[0]
      node.children.unshift({type: 'text', value: delimiters[0]})
      node.children.push({type: 'text', value: delimiters[1]})
    }
  }
})

export default rehypeMathJaxBrowser
