// SVG font glyph data — side-effect imports register SVG path strings on the
// font class for character ranges beyond the static base font.
//
// Only math-essential files are imported (~1.1 MB). Extended scripts (Cyrillic,
// Arabic, Hebrew, Braille, Cherokee, Devanagari, etc.) and extra font variants
// (sans-serif, monospace, phonetics, etc.) are omitted to keep the bundle close
// to v3's ~1 MB. Users needing those ranges can add them via a custom plugin.
//
// Full list of available files (40 total, ~9.9 MB):
//   PUA, accents, accents-b-i, arabic, arrows, braille, braille-d,
//   calligraphic, cherokee, cyrillic, cyrillic-ss, devanagari, double-struck,
//   fraktur, greek, greek-ss, hebrew, latin, latin-b, latin-bi, latin-i,
//   marrows, math, monospace, monospace-ex, monospace-l, mshapes, phonetics,
//   phonetics-ss, sans-serif, sans-serif-b, sans-serif-bi, sans-serif-ex,
//   sans-serif-i, sans-serif-r, script, shapes, symbols, symbols-b-i, variants
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/accents.js'       //  72 KB — accented math characters
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js'        // 229 KB — extended arrows
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/calligraphic.js'  //  40 KB — \mathcal
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js' //  42 KB — \mathbb (ℝ, ℂ, ℤ)
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/fraktur.js'       //  77 KB — \mathfrak
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/marrows.js'       //  43 KB — more arrow shapes
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/math.js'          // 199 KB — extra math symbols
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/mshapes.js'       //  45 KB — math shapes
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/script.js'        //  71 KB — \mathscr
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/shapes.js'        // 111 KB — shapes and delimiters
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/symbols.js'       // 178 KB — extra symbols
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/variants.js'      //  17 KB — TeX variant characters

import {SVG as Svg} from '@mathjax/src/js/output/svg.js'
import {createPlugin} from './create-plugin.js'
import {createRenderer} from './create-renderer.js'

/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with MathJax using SVG.
 *
 * @param [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
const rehypeMathJaxSvg = createPlugin(function (options) {
  // MathJax types do not allow `null`.
  return createRenderer(options, new Svg(options.svg || undefined))
})

export default rehypeMathJaxSvg
