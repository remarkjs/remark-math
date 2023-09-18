/**
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 *
 * @typedef {import('katex').KatexOptions} KatexOptions
 *
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {Omit<KatexOptions, 'throwOnError'>} Options
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
    visit(tree, 'element', function (element, _, parent) {
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
        const cause = /** @type {Error} */ (error)
        const ruleId = cause.name.toLowerCase()

        file.message('Could not render math with KaTeX', {
          /* c8 ignore next -- verbose to test */
          ancestors: parent ? [parent, element] : [element],
          cause,
          place: element.position,
          ruleId,
          source: 'rehype-katex'
        })

        // KaTeX can handle `ParseError` itself, but not others.
        if (ruleId === 'parseerror') {
          result = katex.renderToString(value, {
            ...settings,
            displayMode,
            strict: 'ignore',
            throwOnError: false
          })
        }
        // Generate similar markup if this is an other error.
        // See: <https://github.com/KaTeX/KaTeX/blob/5dc7af0/docs/error.md>.
        else {
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
      }

      const root = fromHtmlIsomorphic(result, {fragment: true})
      // Cast because there will not be `doctypes` in KaTeX result.
      const content = /** @type {Array<ElementContent>} */ (root.children)
      element.children = content
    })
  }
}
