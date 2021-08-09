/**
 * @typedef {import('mdast').Root} Root
 *
 * @typedef {import('mdast-util-math')} DoNotTouchAsThisImportIncludesMathInTree
 */

import {math} from 'micromark-extension-math'
import {mathFromMarkdown, mathToMarkdown} from 'mdast-util-math'

/** @type {boolean|undefined} */
let warningIssued

/**
 * Plugin to support math.
 *
 * @type {import('unified').Plugin<void[], Root>}
 */
export default function remarkMath() {
  const data = this.data()

  // Old remark.
  /* c8 ignore next 14 */
  if (
    !warningIssued &&
    ((this.Parser &&
      this.Parser.prototype &&
      this.Parser.prototype.blockTokenizers) ||
      (this.Compiler &&
        this.Compiler.prototype &&
        this.Compiler.prototype.visitors))
  ) {
    warningIssued = true
    console.warn(
      '[remark-math] Warning: please upgrade to remark 13 to use this plugin'
    )
  }

  add('micromarkExtensions', math)
  add('fromMarkdownExtensions', mathFromMarkdown)
  add('toMarkdownExtensions', mathToMarkdown)

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}
