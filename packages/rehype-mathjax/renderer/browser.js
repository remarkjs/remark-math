module.exports = renderer

function renderer(options) {
  return {render: render}

  function render(value, renderOptions) {
    var delimiters = renderOptions.display
      ? options.displayMath
      : options.inlineMath

    return {type: 'text', value: delimiters.join(value)}
  }
}
