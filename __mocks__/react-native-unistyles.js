const { StyleSheet: RNStyleSheet } = require('react-native')
const { lightTheme } = require('../src/shared/theme/themes')

const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 }

const miniRuntime = {
  insets: defaultInsets,
  screen: { width: 390, height: 844 },
  isLandscape: false
}

const buildSheet = factory => {
  const resolved =
    typeof factory === 'function' ? factory(lightTheme, miniRuntime) : factory
  const staticPart = {}
  const dynamicPart = {}
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === 'function') {
      dynamicPart[key] = value
    } else {
      staticPart[key] = value
    }
  }
  const created = RNStyleSheet.create(staticPart)
  const result = { ...created, useVariants: () => {} }
  for (const [key, fn] of Object.entries(dynamicPart)) {
    result[key] = (...args) => fn(...args)
  }
  return result
}

module.exports = {
  StyleSheet: {
    create: factory => buildSheet(factory),
    absoluteFillObject: RNStyleSheet.absoluteFillObject,
    absoluteFill: RNStyleSheet.absoluteFill,
    compose: RNStyleSheet.compose,
    flatten: RNStyleSheet.flatten,
    configure: () => {},
    init: () => {},
    jsMethods: {
      processColor: () => null,
      parseBoxShadowString: () => []
    },
    hairlineWidth: RNStyleSheet.hairlineWidth,
    unid: -1,
    addChangeListener: () => () => {}
  },
  UnistylesRuntime: {
    setTheme: () => {},
    getTheme: () => lightTheme,
    insets: defaultInsets,
    miniRuntime
  },
  useUnistyles: () => ({
    theme: lightTheme,
    rt: miniRuntime
  })
}
