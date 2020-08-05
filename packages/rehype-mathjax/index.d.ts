// Minimum TypeScript Version: 3.2
import {Plugin} from 'unified'

// Should be ported back to MathJax repo
// http://docs.mathjax.org/en/latest/options/output/svg.html#the-configuration-block
interface MathJaxSvgOptions {
  scale: number
  minScale: number
  mtextInheritFont: boolean
  merrorInheritFont: boolean
  mathmlSpacing: boolean
  skipAttributes: {[index: string]: boolean}
  exFactor: number
  displayAlign: 'left' | 'center' | 'right'
  displayIndent: string
  fontCache: 'local' | 'global'
  localID: string | null
  internalSpeechTitles: true
  titleID: number
}

type RenderSVGOptions = Partial<MathJaxSvgOptions>

declare const renderSvg: Plugin<[RenderSVGOptions?]>

export = renderSvg
