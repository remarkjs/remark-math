const visit = require('unist-util-visit')
const katex = require('katex').renderToString
const unified = require('unified')
const parse = require('rehype-parse')

module.exports = htmlKatex

const assign = Object.assign

const parseHtml = unified().use(parse, {fragment: true, position: false})

const source = 'remark-html-katex'

function htmlKatex(options) {
  const settings = options || {}
  const throwOnError = settings.throwOnError || false

  return transform

  function transform(tree, file) {
    visit(tree, ['inlineMath', 'math'], onmath)

    function onmath(node) {
      const displayMode = node.type === 'math'
      let result

      try {
        result = katex(
          node.value,
          assign({}, settings, {displayMode: displayMode, throwOnError: true})
        )
      } catch (error) {
        const fn = throwOnError ? 'fail' : 'message'
        const origin = [source, error.name.toLowerCase()].join(':')

        file[fn](error.message, node.position, origin)

        result = katex(
          node.value,
          assign({}, settings, {
            displayMode: displayMode,
            throwOnError: false,
            strict: 'ignore'
          })
        )
      }

      node.data.hChildren = parseHtml.parse(result).children
    }
  }
}
