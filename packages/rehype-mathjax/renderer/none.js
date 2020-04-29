class NoneRenderer {
  constructor(options) {
    this.displayMath = options.displayMath
    this.inlineMath = options.inlineMath
  }

  get styleSheet() {
    return {type: 'text', value: ''}
  }

  render(math, options) {
    return options.display
      ? {type: 'text', value: this.displayMath.join(math)}
      : {type: 'text', value: this.inlineMath.join(math)}
  }
}

module.exports = NoneRenderer
