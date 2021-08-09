/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @typedef {[string, string]} MathNotation
 *   Markers to use for math.
 *   See: <http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block>
 *
 * @typedef OutputSvgOptions
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
 * @typedef OutputCHtmlOptions
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
 * @typedef InputTexOptions
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
 * @typedef Options
 *   Configuration.
 * @property {InputTexOptions} [tex]
 *   Configuration for the input TeX.
 * @property {OutputCHtmlOptions} [chtml]
 *   Configuration for the output (when CHTML).
 * @property {OutputSvgOptions} [svg]
 *   Configuration for the output (when SVG).
 *
 * @typedef Renderer
 * @property {(node: Element, options: {display: boolean}) => void} render
 * @property {() => Element} [styleSheet]
 *
 * @callback CreateRenderer
 * @param {Options} options
 * @returns {Renderer}
 */

import {visit, SKIP} from 'unist-util-visit'

/**
 * @param {CreateRenderer} createRenderer
 */
export function createPlugin(createRenderer) {
  /** @type {import('unified').Plugin<[Options?]|void[], Root>} */
  return (options = {}) =>
    (tree) => {
      const renderer = createRenderer(options)
      let found = false
      /** @type {Root|Element} */
      let context = tree

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
