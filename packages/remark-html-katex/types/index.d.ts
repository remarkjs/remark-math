import {Plugin} from 'unified'
import {KatexOptions} from 'katex'

type HtmlKatexOptions = KatexOptions

declare const htmlKatex: Plugin<[HtmlKatexOptions?]>

export = htmlKatex
