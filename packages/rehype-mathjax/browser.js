/**
 * @typedef {import('./lib/create-plugin').Options} Options
 */

import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxBrowser = createPlugin((options) => {
  const tex = options.tex || {}
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
