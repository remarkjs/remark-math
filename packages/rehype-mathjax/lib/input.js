const Tex = require('mathjax-full/js/input/tex').TeX
const packages = require('mathjax-full/js/input/tex/AllPackages').AllPackages

module.exports = createInput

function createInput() {
  return new Tex({packages: packages})
}
