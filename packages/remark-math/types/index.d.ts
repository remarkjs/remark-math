import {Plugin} from 'unified'

interface RemarkMathOptions {
  inlineMathDouble?: boolean
}

declare const math: Plugin<[RemarkMathOptions?]>

export = math
