import {Plugin} from 'unified'

// http://docs.mathjax.org/en/latest/options/input/tex.html#the-configuration-block
type MathNotation = [string, string]
interface BrowserOptions {
  displayMath?: MathNotation | MathNotation[]
  inlineMath?: MathNotation | MathNotation[]
}

declare const renderBrowser: Plugin<[BrowserOptions?]>

export = renderBrowser
