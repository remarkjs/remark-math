import {Plugin} from 'unified'

export interface RemarkMathOptions {
  inlineMathDouble: boolean
}

declare const math: Plugin<[Partial<RemarkMathOptions>?]>

export = math
