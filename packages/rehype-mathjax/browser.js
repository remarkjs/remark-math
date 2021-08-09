/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 * @typedef {import('./lib/create-plugin').MathNotation} MathNotation
 * @typedef {import('./lib/create-plugin').BrowserOptions} Options
 */

import {createPlugin} from './lib/create-plugin.js'

const rehypeMathJaxBrowser =
  /** @type {import('unified').Plugin<[Options?]|void[], Root>} */ (
    createPlugin(
      // To do next major: Make `options` match the format of MathJax options
      // `{tex: ...}`
      (_, options) => {
        /** @type {MathNotation} */
        let display = ['\\[', '\\]']
        /** @type {MathNotation} */
        let inline = ['\\(', '\\)']

        if ('displayMath' in options && options.displayMath) {
          display = options.displayMath
        }

        if ('inlineMath' in options && options.inlineMath) {
          inline = options.inlineMath
        }

        return {
          render(node, options) {
            const delimiters = options.display ? display : inline
            node.children.unshift({type: 'text', value: delimiters[0]})
            node.children.push({type: 'text', value: delimiters[1]})
          }
        }
      }
    )
  )

export default rehypeMathJaxBrowser
