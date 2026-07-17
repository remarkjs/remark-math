import rehypeParse from 'rehype-parse'
import {unified} from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkMath from 'remark-math'
import rehypeMathJaxBrowser from '../browser.js'
import rehypeMathJaxChtml from '../chtml.js'
import rehypeMathJaxSvg from '../svg.js'
/** @import { VFile } from 'vfile' */

export const base = new URL('fixture/', import.meta.url)
const fontURL =
  'https://cdn.jsdelivr.net/npm/@mathjax/mathjax-newcm-font/chtml/woff2'

/**
 * @type {Array<{description: string, input: string, output: string, process: (inp: Buffer) => Promise<VFile>}>}
 */
export const fixtures = [
  {
    description: 'should render SVG',
    input: 'small.html',
    output: 'small-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render CHTML',
    input: 'small.html',
    output: 'small-chtml.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml, {chtml: {fontURL}})
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render browser',
    input: 'small.html',
    output: 'small-browser.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxBrowser)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should support markdown fenced code',
    input: 'markdown-code-fenced.md',
    output: 'markdown-code-fenced-svg.html',
    process(md) {
      return unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(md)
    }
  },
  {
    description: 'should integrate with `remark-math`',
    input: 'markdown.md',
    output: 'markdown-svg.html',
    process(md) {
      return unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(md)
    }
  },
  {
    description: 'should transform `.math-inline.math-display`',
    input: 'double.html',
    output: 'double-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should transform documents without math',
    input: 'none.html',
    output: 'none-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should transform complete documents',
    input: 'document.html',
    output: 'document-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse)
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description:
      'should support custom `inlineMath` and `displayMath` delimiters for browser',
    input: 'small.html',
    output: 'small-browser-delimiters.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxBrowser, {
          tex: {
            displayMath: [['$$', '$$']],
            inlineMath: [['$', '$']]
          }
        })
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render SVG with equation numbers',
    input: 'equation-numbering-1.html',
    output: 'equation-numbering-1-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render SVG with reference to an undefined equation',
    input: 'equation-numbering-2.html',
    output: 'equation-numbering-2-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg, {tex: {tags: 'ams'}})
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render CHTML with equation numbers',
    input: 'equation-numbering-1.html',
    output: 'equation-numbering-1-chtml.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml, {
          chtml: {fontURL: 'place/to/fonts'},
          tex: {tags: 'ams'}
        })
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render errors',
    input: 'error.html',
    output: 'error-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render CHTML with MathJax plugins',
    input: 'bussproofs.html',
    output: 'bussproofs-chtml.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxChtml, {chtml: {fontURL}})
        .use(rehypeStringify)
        .process(html)
    }
  },
  {
    description: 'should render SVG with MathJax plugins',
    input: 'bussproofs.html',
    output: 'bussproofs-svg.html',
    process(html) {
      return unified()
        .use(rehypeParse, {fragment: true})
        .use(rehypeMathJaxSvg)
        .use(rehypeStringify)
        .process(html)
    }
  }
]
