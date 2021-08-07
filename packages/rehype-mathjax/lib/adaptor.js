import {JSDOM} from 'jsdom'
import {jsdomAdaptor} from 'mathjax-full/js/adaptors/jsdomAdaptor.js'

export function createAdaptor() {
  return jsdomAdaptor(JSDOM)
}
