/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @typedef {[string, string]} MathNotation
 *   Markers to use for math.
 *   See: <http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block>
 *
 * @typedef BrowserOptions
 *   Configuration.
 * @property {MathNotation} [displayMath]
 *   Markers to use for blocks.
 * @property {MathNotation} [inlineMath]
 *   Markers to use for inlines.
 *
 * @typedef MathJaxSvgOptions
 *   <http://docs.mathjax.org/en/latest/options/output/svg.html#the-configuration-block>
 * @property {number} [scale]
 * @property {number} [minScale]
 * @property {boolean} [mtextInheritFont]
 * @property {boolean} [merrorInheritFont]
 * @property {boolean} [mathmlSpacing]
 * @property {Record<string, boolean>} [skipAttributes]
 * @property {number} [exFactor]
 * @property {'left'|'center'|'right'} [displayAlign]
 * @property {string} [displayIndent]
 * @property {'local'|'global'} [fontCache]
 * @property {string|null} [localID]
 * @property {boolean} [internalSpeechTitles]
 * @property {number} [titleID]
 *
 * @typedef MathJaxCHtmlOptions
 *   <http://docs.mathjax.org/en/latest/options/output/chtml.html#the-configuration-block>
 * @property {number} [scale]
 * @property {number} [minScale]
 * @property {boolean} [matchFontHeight]
 * @property {boolean} [mtextInheritFont]
 * @property {boolean} [merrorInheritFont]
 * @property {boolean} [mathmlSpacing]
 * @property {Record<string, boolean>} [skipAttributes]
 * @property {number} [exFactor]
 * @property {'left'|'center'|'right'} [displayAlign]
 * @property {string} [displayIndent]
 * @property {string} fontURL
 * @property {boolean} [adaptiveCSS]
 *
 * @typedef MathJaxInputTexOptions
 *   <http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block>
 * @property {string[]} [packages]
 * @property {MathNotation[]} [inlineMath]
 * @property {MathNotation[]} [displayMath]
 * @property {boolean} [processEscapes]
 * @property {boolean} [processEnvironments]
 * @property {boolean} [processRefs]
 * @property {RegExp} [digits]
 * @property {'none'|'ams'|'all'} [tags]
 * @property {'left'|'right'} [tagSide]
 * @property {string} [tagIndent]
 * @property {boolean} [useLabelIds]
 * @property {string} [multlineWidth]
 * @property {number} [maxMacros]
 * @property {number} [maxBuffer]
 * @property {string} [baseURL]
 * @property {(jax: any, error: any) => string} [formatError]
 *
 * @typedef {MathJaxCHtmlOptions & {tex?: MathJaxInputTexOptions}} CHtmlOptions
 * @typedef {MathJaxSvgOptions & {tex?: MathJaxInputTexOptions}} SvgOptions
 *
 * @typedef {BrowserOptions|CHtmlOptions|SvgOptions} Options
 *
 * @typedef Renderer
 * @property {(node: Element, options: {display: boolean}) => void} render
 * @property {() => Element} [styleSheet]
 *
 * @callback CreateRenderer
 * @param {MathJaxInputTexOptions} inputOptions
 * @param {MathJaxCHtmlOptions|MathJaxSvgOptions|BrowserOptions} outputOptions
 * @returns {Renderer}
 */

import {visit, SKIP} from 'unist-util-visit'

// To do next major: Remove `chtml` and `browser` flags once all the options use
// the same format.

/**
 * @param {CreateRenderer} createRenderer
 * @param {boolean} [chtml=false]
 */
export function createPlugin(createRenderer, chtml) {
  /** @type {import('unified').Plugin<[Options?]|void[], Root>} */
  return (options = {}) => {
    if (chtml && (!('fontURL' in options) || !options.fontURL)) {
      throw new Error(
        'rehype-mathjax: missing `fontURL` in options, which must be set to a URL to reach MathJaX fonts'
      )
    }

    // @ts-expect-error: hush.
    const {tex, ...outputOptions} = options

    return (tree) => {
      const renderer = createRenderer(tex || {}, outputOptions)
      /** @type {Root|Element} */
      let context = tree
      let found = false

      visit(tree, 'element', (node) => {
        const classes =
          node.properties && Array.isArray(node.properties.className)
            ? node.properties.className
            : []
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
