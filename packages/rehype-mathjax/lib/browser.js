/**
 * @typedef {import('./create-plugin.js').InputTexOptions} InputTexOptions
 */

import {createPlugin} from './create-plugin.js'

/** @type {Readonly<InputTexOptions>} */
const emptyTexOptions = {}

/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with MathJax with marker for MathJax in the browser.
 *
 * @param [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
const rehypeMathJaxBrowser = createPlugin(function (options) {
  const tex = options.tex || emptyTexOptions
  const display = tex.displayMath || [['\\[', '\\]']]
  const inline = tex.inlineMath || [['\\(', '\\)']]

  return {
    render(value, options) {
      const delimiters = (options.display ? display : inline)[0]
      return [{type: 'text', value: delimiters[0] + value + delimiters[1]}]
    }
  }
})

export default rehypeMathJaxBrowser
