// TeX extension side-effect imports (registers each package with MathJax).
// Includes all v4 packages except autoload (requires async asyncLoad) and
// bboldx (requires font variant not in NCM).
import '@mathjax/src/js/input/tex/action/ActionConfiguration.js'
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js'
import '@mathjax/src/js/input/tex/amscd/AmsCdConfiguration.js'
import '@mathjax/src/js/input/tex/base/BaseConfiguration.js'
import '@mathjax/src/js/input/tex/bbm/BbmConfiguration.js'
// bboldx omitted — requires -bboldx font variant not in the NCM font package.
import '@mathjax/src/js/input/tex/bbox/BboxConfiguration.js'
import '@mathjax/src/js/input/tex/begingroup/BegingroupConfiguration.js'
import '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js'
import '@mathjax/src/js/input/tex/braket/BraketConfiguration.js'
import '@mathjax/src/js/input/tex/bussproofs/BussproofsConfiguration.js'
import '@mathjax/src/js/input/tex/cancel/CancelConfiguration.js'
import '@mathjax/src/js/input/tex/cases/CasesConfiguration.js'
import '@mathjax/src/js/input/tex/centernot/CenternotConfiguration.js'
import '@mathjax/src/js/input/tex/color/ColorConfiguration.js'
import '@mathjax/src/js/input/tex/colortbl/ColortblConfiguration.js'
import '@mathjax/src/js/input/tex/colorv2/ColorV2Configuration.js'
import '@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js'
import '@mathjax/src/js/input/tex/dsfont/DsfontConfiguration.js'
import '@mathjax/src/js/input/tex/empheq/EmpheqConfiguration.js'
import '@mathjax/src/js/input/tex/enclose/EncloseConfiguration.js'
import '@mathjax/src/js/input/tex/extpfeil/ExtpfeilConfiguration.js'
import '@mathjax/src/js/input/tex/gensymb/GensymbConfiguration.js'
import '@mathjax/src/js/input/tex/html/HtmlConfiguration.js'
import '@mathjax/src/js/input/tex/mathtools/MathtoolsConfiguration.js'
import '@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js'
import '@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js'
import '@mathjax/src/js/input/tex/noerrors/NoErrorsConfiguration.js'
import '@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js'
import '@mathjax/src/js/input/tex/physics/PhysicsConfiguration.js'
import '@mathjax/src/js/input/tex/require/RequireConfiguration.js'
import '@mathjax/src/js/input/tex/setoptions/SetOptionsConfiguration.js'
import '@mathjax/src/js/input/tex/tagformat/TagFormatConfiguration.js'
import '@mathjax/src/js/input/tex/texhtml/TexHtmlConfiguration.js'
import '@mathjax/src/js/input/tex/textcomp/TextcompConfiguration.js'
import '@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js'
import '@mathjax/src/js/input/tex/unicode/UnicodeConfiguration.js'
import '@mathjax/src/js/input/tex/units/UnitsConfiguration.js'
import '@mathjax/src/js/input/tex/upgreek/UpgreekConfiguration.js'
import '@mathjax/src/js/input/tex/verb/VerbConfiguration.js'

/**
 * All TeX packages (all v4 extensions minus autoload and bboldx).
 *
 * Note: `physics` redefines `\div`, `\Re`, `\Im`, and trig/log functions.
 * `colorv2` overrides `\color` from the `color` package.
 * Both are included to match v3's AllPackages behavior.
 *
 * @type {ReadonlyArray<string>}
 */
export const allPackages = [
  'action',
  'ams',
  'amscd',
  'base',
  'bbm',
  'bbox',
  'begingroup',
  'boldsymbol',
  'braket',
  'bussproofs',
  'cancel',
  'cases',
  'centernot',
  'color',
  'colortbl',
  'colorv2',
  'configmacros',
  'dsfont',
  'empheq',
  'enclose',
  'extpfeil',
  'gensymb',
  'html',
  'mathtools',
  'mhchem',
  'newcommand',
  'noerrors',
  'noundefined',
  'physics',
  'require',
  'setoptions',
  'tagformat',
  'texhtml',
  'textcomp',
  'textmacros',
  'unicode',
  'units',
  'upgreek',
  'verb'
]
