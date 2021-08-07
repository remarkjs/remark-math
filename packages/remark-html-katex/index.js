import visit from 'unist-util-visit'
import removePosition from 'unist-util-remove-position'
import katex from 'katex'
import unified from 'unified'
import rehypeParse from 'rehype-parse'

const parseHtml = unified().use(rehypeParse, {fragment: true})

const source = 'remark-html-katex'

export default function remarkHtmlKatex(options) {
  const settings = options || {}
  const throwOnError = settings.throwOnError || false

  return transform

  function transform(tree, file) {
    visit(tree, ['inlineMath', 'math'], onmath)

    function onmath(node) {
      const displayMode = node.type === 'math'
      let result

      try {
        result = katex.renderToString(
          node.value,
          Object.assign({}, settings, {
            displayMode: displayMode,
            throwOnError: true
          })
        )
      } catch (error) {
        const fn = throwOnError ? 'fail' : 'message'
        const origin = [source, error.name.toLowerCase()].join(':')

        file[fn](error.message, node.position, origin)

        result = katex.renderToString(
          node.value,
          Object.assign({}, settings, {
            displayMode: displayMode,
            throwOnError: false,
            strict: 'ignore'
          })
        )
      }

      node.data.hChildren = removePosition(parseHtml.parse(result)).children
    }
  }
}
