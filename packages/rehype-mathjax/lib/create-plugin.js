/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('hast').Root} Root
 */

/**
 * @callback CreateRenderer
 *   Create a renderer.
 * @param {Readonly<Options>} options
 *   Configuration.
 * @returns {Renderer}
 *   Rendeder.
 *
 * @callback FormatError
 *   Format an error.
 * @param {any} jax
 *   MathJax object.
 * @param {any} error
 *   Error.
 * @returns {string}
 *   Formatted error.
 *
 * @typedef InputTexOptions
 *   Configuration for input tex math.
 *   <http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block>
 * @property {string | null | undefined} [baseURL]
 *   URL for use with links to tags, when there is a `<base>` tag in effect
 *   (optional).
 * @property {RegExp | null | undefined} [digits]
 *   Pattern for recognizing numbers (optional).
 * @property {ReadonlyArray<MathNotation> | null | undefined} [displayMath]
 *   Start/end delimiter pairs for display math (optional).
 * @property {FormatError | null | undefined} [formatError]
 *   Function called when TeX syntax errors occur (optional).
 * @property {ReadonlyArray<MathNotation> | null | undefined} [inlineMath]
 *   Start/end delimiter pairs for in-line math (optional).
 * @property {number | null | undefined} [maxBuffer]
 *   Max size for the internal TeX string (5K) (optional).
 * @property {number | null | undefined} [maxMacros]
 *   Max number of macro substitutions per expression (optional).
 * @property {ReadonlyArray<string> | null | undefined} [packages]
 *   Extensions to use (optional).
 * @property {boolean | null | undefined} [processEnvironments]
 *   Process `\begin{xxx}...\end{xxx}` outside math mode (optional).
 * @property {boolean | null | undefined} [processEscapes]
 *   Use `\$` to produce a literal dollar sign (optional).
 * @property {boolean | null | undefined} [processRefs]
 *   Process `\ref{...}` outside of math mode (optional).
 * @property {string | null | undefined} [tagIndent]
 *   Amount to indent tags (optional).
 * @property {'left' | 'right' | null | undefined} [tagSide]
 *   Side for `\tag` macros (optional).
 * @property {'all' | 'ams' | 'none' | null | undefined} [tags]
 *   Optional.
 * @property {boolean | null | undefined} [useLabelIds]
 *   Use label name rather than tag for ids (optional).
 *
 * @typedef {[string, string]} MathNotation
 *   Markers to use for math.
 *   See: <http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block>
 *
 * @typedef Options
 *   Configuration.
 * @property {Readonly<OutputCHtmlOptions> | null | undefined} [chtml]
 *   Configuration for the output, when CHTML (optional).
 * @property {Readonly<OutputSvgOptions> | null | undefined} [svg]
 *   Configuration for the output, when SVG (optional).
 * @property {Readonly<InputTexOptions> | null | undefined} [tex]
 *   Configuration for the input TeX (optional).
 *
 * @typedef OutputCHtmlOptions
 *   Configuration for output CHTML.
 *   <http://docs.mathjax.org/en/latest/options/output/chtml.html#the-configuration-block>
 * @property {boolean | null | undefined} [adaptiveCSS]
 *   `true` means only produce CSS that is used in the processed equations (optional).
 * @property {'center' | 'left' | 'right' | null | undefined} [displayAlign]
 *   Default for indentalign when set to `'auto'` (optional).
 * @property {string | null | undefined} [displayIndent]
 *   Default for indentshift when set to `'auto'` (optional).
 * @property {number | null | undefined} [exFactor]
 *   Default size of ex in em units (optional).
 * @property {string} fontURL
 *   The URL where the fonts are found (**required**).
 * @property {boolean | null | undefined} [matchFontHeight]
 *   `true` to match ex-height of surrounding font (optional).
 * @property {boolean | null | undefined} [mathmlSpacing]
 *   `true` for MathML spacing rules, false for TeX rules (optional).
 * @property {boolean | null | undefined} [merrorInheritFont]
 *   `true` to make merror text use surrounding font (optional).
 * @property {number | null | undefined} [minScale]
 *   Smallest scaling factor to use (optional).
 * @property {boolean | null | undefined} [mtextInheritFont]
 *   `true` to make mtext elements use surrounding font (optional).
 * @property {number | null | undefined} [scale]
 *   Global scaling factor for all expressions (optional).
 * @property {Readonly<Record<string, boolean>> | null | undefined} [skipAttributes]
 *   RFDa and other attributes NOT to copy to the output (optional).
 *
 * @typedef OutputSvgOptions
 *   Configuration for output SVG.
 *   <http://docs.mathjax.org/en/latest/options/output/svg.html#the-configuration-block>
 * @property {'center' | 'left' | 'right' | null | undefined} [displayAlign]
 *   Default for indentalign when set to `'auto'` (optional).
 * @property {string | null | undefined} [displayIndent]
 *   Default for indentshift when set to `'auto'` (optional).
 * @property {number | null | undefined} [exFactor]
 *   Default size of ex in em units (optional).
 * @property {'global' | 'local' | 'none' | null | undefined} [fontCache]
 *   Or `'global'` or `'none'` (optional).
 * @property {boolean | null | undefined} [internalSpeechTitles]
 *   Insert `<title>` tags with speech content (optional).
 * @property {string | null | undefined} [localID]
 *   ID to use for local font cache, for single equation processing (optional).
 * @property {boolean | null | undefined} [mathmlSpacing]
 *   `true` for MathML spacing rules, `false` for TeX rules (optional).
 * @property {boolean | null | undefined} [merrorInheritFont]
 *   `true` to make merror text use surrounding font (optional).
 * @property {number | null | undefined} [minScale]
 *   Smallest scaling factor to use (optional).
 * @property {boolean | null | undefined} [mtextInheritFont]
 *   `true` to make mtext elements use surrounding font (optional).
 * @property {number | null | undefined} [scale]
 *   Global scaling factor for all expressions (optional).
 * @property {Readonly<Record<string, boolean>> | null | undefined} [skipAttributes]
 *   RFDa and other attributes *not* to copy to the output (optional).
 * @property {number | null | undefined} [titleID]
 *   Initial ID number to use for `aria-labeledby` titles (optional).
 *
 * @callback Render
 *   Render a math node.
 * @param {Element} element
 *   Math node.
 * @param {Readonly<RenderOptions>} options
 *   Configuration.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef RenderOptions
 *   Configuration.
 * @property {boolean} display
 *   Whether to render display math.
 *
 * @typedef Renderer
 *   Renderer.
 * @property {Render} render
 *   Render a math node.
 * @property {StyleSheet | null | undefined} [styleSheet]
 *   Render a style sheet (optional).
 *
 * @callback StyleSheet
 *   Render a style sheet.
 * @returns {Element}
 *   Style sheet.
 */

import {SKIP, visit} from 'unist-util-visit'

/** @type {Readonly<Options>} */
const emptyOptions = {}
/** @type {ReadonlyArray<unknown>} */
const emptyClasses = []

/**
 * Create a plugin.
 *
 * @param {CreateRenderer} createRenderer
 *   Create a renderer.
 * @returns
 *   Plugin.
 */
export function createPlugin(createRenderer) {
  /**
   * Plugin.
   *
   * @param {Readonly<Options> | null | undefined} [options]
   *   Configuration (optional).
   * @returns
   *   Transform.
   */
  return function (options) {
    /**
     * Transform.
     *
     * @param {Root} tree
     *   Tree.
     * @returns {undefined}
     *   Nothing.
     */
    return function (tree) {
      const renderer = createRenderer(options || emptyOptions)
      let found = false
      /** @type {Element | Root} */
      let context = tree

      visit(tree, 'element', function (node) {
        const classes = Array.isArray(node.properties.className)
          ? node.properties.className
          : emptyClasses
        const inline = classes.includes('math-inline')
        const display = classes.includes('math-display')

        if (node.tagName === 'head') {
          context = node
        }

        if (!inline && !display) {
          return
        }

        found = true
        renderer.render(node, {display})

        return SKIP
      })

      if (found && renderer.styleSheet) {
        context.children.push(renderer.styleSheet())
      }
    }
  }
}
