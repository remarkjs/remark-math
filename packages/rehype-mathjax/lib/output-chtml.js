import {CHTML} from 'mathjax-full/js/output/chtml.js'

export function createOutput(options) {
  return new CHTML(options)
}
