import {JSDOM} from 'jsdom'
import {jsdomAdaptor as jsdomAdapter} from 'mathjax-full/js/adaptors/jsdomAdaptor.js'

export function createAdapter() {
  return jsdomAdapter(JSDOM)
}
