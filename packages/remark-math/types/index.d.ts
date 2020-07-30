// TypeScript Version: 3.4

import {Plugin} from 'unified'

interface RemarkMathOptions {
  /**
   * Add an extra `math-display` class to inline `$$` math
   *
   * @defaultValue false
   */
  inlineMathDouble?: boolean
}

declare const remarkMath: Plugin<[RemarkMathOptions?]>

export = remarkMath
