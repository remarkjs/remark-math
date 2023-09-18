/**
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 *
 * @typedef {import('katex').KatexOptions} Options
 *
 * @typedef {import('vfile').VFile} VFile
 */

import {fromHtmlIsomorphic} from 'hast-util-from-html-isomorphic'
import {toText} from 'hast-util-to-text'
import katex from 'katex'
import {visit} from 'unist-util-visit'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<unknown>} */
const emptyClasses = []

/**
 * Plugin to transform `<span class=math-inline>` and `<div class=math-display>`
 * with KaTeX.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeKatex(options) {
  const settings = options || emptyOptions
  const throwOnError = settings.throwOnError || false

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree, file) {
    visit(tree, 'element', function (element) {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : emptyClasses
      const inline = classes.includes('math-inline')
      const displayMode = classes.includes('math-display')

      if (!inline && !displayMode) {
        return
      }

      const value = toText(element, {whitespace: 'pre'})

      /** @type {string} */
      let result

      try {
        result = katex.renderToString(value, {
          ...settings,
          displayMode,
          throwOnError: true
        })
      } catch (error) {
        const exception = /** @type {Error} */ (error)
        const fn = throwOnError ? 'fail' : 'message'
        const origin = ['rehype-katex', exception.name.toLowerCase()].join(':')

        file[fn](exception.message, element.position, origin)

        // KaTeX can handle `ParseError` itself, but not others.
        // Generate similar markup if this is an other error.
        // See: <https://github.com/KaTeX/KaTeX/blob/5dc7af0/docs/error.md>.
        if (exception.name !== 'ParseError') {
          element.children = [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['katex-error'],
                style: 'color:' + (settings.errorColor || '#cc0000'),
                title: String(error)
              },
              children: [{type: 'text', value}]
            }
          ]
          return
        }

        result = katex.renderToString(value, {
          ...settings,
          displayMode,
          strict: 'ignore',
          throwOnError: false
        })
      }

      const root = fromHtmlIsomorphic(result, {fragment: true})
      // Cast because there will not be `doctypes` in KaTeX result.
      const content = /** @type {Array<ElementContent>} */ (root.children)
      element.children = content
    })
  }
}
