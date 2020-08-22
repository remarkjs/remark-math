import {Plugin} from 'unified' // eslint-disable-line import/no-extraneous-dependencies

// http://docs.mathjax.org/en/latest/options/output/chtml.html#the-configuration-block
interface MathJaxCHtmlOptions {
  scale?: number
  minScale?: number
  matchFontHeight?: boolean
  mtextInheritFont?: boolean
  merrorInheritFont?: boolean
  mathmlSpacing?: boolean
  skipAttributes?: {[index: string]: boolean}
  exFactor?: number
  displayAlign?: 'left' | 'center' | 'right'
  displayIndent?: string
  fontURL: string
  adaptiveCSS?: boolean
}

declare const renderCHtml: Plugin<[MathJaxCHtmlOptions]>

export = renderCHtml
