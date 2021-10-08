/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('katex').KatexOptions} Options
 */

import katex from 'katex'
import {visit} from 'unist-util-visit'
import {removePosition} from 'unist-util-remove-position'
import {toText} from 'hast-util-to-text'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'

const assign = Object.assign

const parseHtml = unified().use(rehypeParse, {fragment: true})

const source = 'rehype-katex'

/**
 * Plugin to transform `<span class=math-inline>` and `<div class=math-display>`
 * with KaTeX.
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function rehypeKatex(options) {
  const settings = options || {}
  const throwOnError = settings.throwOnError || false

  return (tree, file) => {
    visit(tree, 'element', (element) => {
      const classes =
        element.properties && Array.isArray(element.properties.className)
          ? element.properties.className
          : []
      const inline = classes.includes('math-inline')
      const displayMode = classes.includes('math-display')

      if (!inline && !displayMode) {
        return
      }

      const value = toText(element, {whitespace: 'pre'})

      /** @type {string} */
      let result

      try {
        result = katex.renderToString(
          value,
          assign({}, settings, {displayMode, throwOnError: true})
        )
      } catch (error_) {
        const error = /** @type {Error} */ (error_)
        const fn = throwOnError ? 'fail' : 'message'
        const origin = [source, error.name.toLowerCase()].join(':')

        file[fn](error.message, element.position, origin)

        result = katex.renderToString(
          value,
          assign({}, settings, {
            displayMode,
            throwOnError: false,
            strict: 'ignore'
          })
        )
      }

      // @ts-expect-error: assume no `doctypes` in KaTeX result.
      element.children = removePosition(parseHtml.parse(result), true).children
    })
  }
}
