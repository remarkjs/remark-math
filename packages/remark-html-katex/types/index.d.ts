import {Plugin} from 'unified'
import {KatexOptions} from 'katex'

type HTMLKatexOptions = KatexOptions

declare const htmlKatex: Plugin<[HTMLKatexOptions?]>

export = htmlKatex
