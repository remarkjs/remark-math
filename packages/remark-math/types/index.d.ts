import {Plugin} from 'unified'

interface RemarkMathOptions {
  inlineMathDouble: boolean
}

declare const math: Plugin<[Partial<RemarkMathOptions>?]>

export = math
