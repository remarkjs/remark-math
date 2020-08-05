import {Plugin} from 'unified' // eslint-disable-line import/no-extraneous-dependencies

interface RemarkMathOptions {
  inlineMathDouble?: boolean
}

declare const math: Plugin<[RemarkMathOptions?]>

export = math
