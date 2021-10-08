/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('katex').KatexOptions} Options
 */

import {visit} from 'unist-util-visit'
import {removePosition} from 'unist-util-remove-position'
import katex from 'katex'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'

const parseHtml = unified().use(rehypeParse, {fragment: true})

const source = 'remark-html-katex'

/**
 * Plugin to transform `inlineMath` and `math` nodes with KaTeX for
 * `remark-html`.
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function remarkHtmlKatex(options = {}) {
  const throwOnError = options.throwOnError || false

  return (tree, file) => {
    visit(tree, (node) => {
      if (node.type === 'inlineMath' || node.type === 'math') {
        const displayMode = node.type === 'math'
        /** @type {string} */
        let result

        try {
          result = katex.renderToString(
            node.value,
            Object.assign({}, options, {
              displayMode,
              throwOnError: true
            })
          )
        } catch (error_) {
          const error = /** @type {Error} */ (error_)
          const fn = throwOnError ? 'fail' : 'message'
          const origin = [source, error.name.toLowerCase()].join(':')

          file[fn](error.message, node.position, origin)

          result = katex.renderToString(
            node.value,
            Object.assign({}, options, {
              displayMode,
              throwOnError: false,
              strict: 'ignore'
            })
          )
        }

        const data = node.data || (node.data = {})

        data.hChildren = removePosition(parseHtml.parse(result)).children
      }
    })
  }
}
