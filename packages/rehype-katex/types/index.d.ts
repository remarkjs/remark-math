import {Plugin} from 'unified'
import {KatexOptions} from 'katex'

export type RehypeKatexOptions = KatexOptions

declare const rehypeKatex: Plugin<[RehypeKatexOptions?]>

export = rehypeKatex
