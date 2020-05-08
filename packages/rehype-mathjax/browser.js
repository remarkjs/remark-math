const createPlugin = require('./lib/core')

module.exports = createPlugin('rehypeMathJaxBrowser', renderBrowser)

function renderBrowser(options) {
  const config = {
    displayMath: ['\\[', '\\]'],
    inlineMath: ['\\(', '\\)'],
    ...options
  }

  return {render: render}

  function render(value, renderOptions) {
    const delimiters = renderOptions.display
      ? config.displayMath
      : config.inlineMath

    return {type: 'text', value: delimiters.join(value)}
  }
}
