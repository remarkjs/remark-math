import {Plugin} from 'unified' // eslint-disable-line import/no-extraneous-dependencies

declare namespace remarkMath {
  type Math = Plugin<[RemarkMathOptions?]>

  interface RemarkMathOptions {
    inlineMathDouble?: boolean
  }
}

declare const remarkMath: remarkMath.Math

export = remarkMath
