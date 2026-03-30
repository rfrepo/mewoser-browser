import { darkTheme, lightTheme } from '../themes'

const semanticColourKeys = [
  'bg',
  'surface',
  'surfaceMuted',
  'surfaceRaised',
  'surfaceOverlay',
  'textPrimary',
  'textSecondary',
  'textInverse',
  'border',
  'borderStrong',
  'primary',
  'primaryHover',
  'primaryPressed',
  'focusRing',
  'success',
  'successBg',
  'warning',
  'warningBg',
  'error',
  'errorBg',
  'info',
  'infoBg'
] as const

describe('themes', () => {
  it('should expose only semantic colour roles in light and dark themes', () => {
    expect(Object.keys(lightTheme.colours).sort()).toEqual([...semanticColourKeys].sort())
    expect(Object.keys(darkTheme.colours).sort()).toEqual([...semanticColourKeys].sort())
  })

  it('should match canonical UI-system light colour values', () => {
    expect(lightTheme.colours.bg).toBe('#FFFFFF')
    expect(lightTheme.colours.surface).toBe('#FFFFFF')
    expect(lightTheme.colours.surfaceRaised).toBe('#F7F8FA')
    expect(lightTheme.colours.surfaceOverlay).toBe('#FFFFFF')
    expect(lightTheme.colours.textPrimary).toBe('#1C2230')
    expect(lightTheme.colours.textSecondary).toBe('#5B6475')
    expect(lightTheme.colours.textInverse).toBe('#FFFFFF')
    expect(lightTheme.colours.border).toBe('#D5DBE5')
    expect(lightTheme.colours.borderStrong).toBe('#A7B0BF')
    expect(lightTheme.colours.primary).toBe('#3D63DD')
    expect(lightTheme.colours.primaryHover).toBe('#3557C5')
    expect(lightTheme.colours.primaryPressed).toBe('#2C49A8')
    expect(lightTheme.colours.focusRing).toBe('#84A2FF')
    expect(lightTheme.colours.success).toBe('#18794E')
    expect(lightTheme.colours.successBg).toBe('#E9F7EF')
    expect(lightTheme.colours.warning).toBe('#A15C00')
    expect(lightTheme.colours.warningBg).toBe('#FFF4D6')
    expect(lightTheme.colours.error).toBe('#C22931')
    expect(lightTheme.colours.errorBg).toBe('#FDEBEC')
    expect(lightTheme.colours.info).toBe('#0B6BCB')
    expect(lightTheme.colours.infoBg).toBe('#EAF3FF')
  })

  it('should match canonical UI-system dark colour values', () => {
    expect(darkTheme.colours.bg).toBe('#0F1218')
    expect(darkTheme.colours.surface).toBe('#141922')
    expect(darkTheme.colours.surfaceRaised).toBe('#1A2130')
    expect(darkTheme.colours.surfaceOverlay).toBe('#20293A')
    expect(darkTheme.colours.textPrimary).toBe('#F7F9FC')
    expect(darkTheme.colours.textSecondary).toBe('#B6C0D1')
    expect(darkTheme.colours.textInverse).toBe('#0F1218')
    expect(darkTheme.colours.border).toBe('#344055')
    expect(darkTheme.colours.borderStrong).toBe('#50617F')
    expect(darkTheme.colours.primary).toBe('#8AA4FF')
    expect(darkTheme.colours.primaryHover).toBe('#9AB1FF')
    expect(darkTheme.colours.primaryPressed).toBe('#6F8EFF')
    expect(darkTheme.colours.focusRing).toBe('#A9BDFF')
    expect(darkTheme.colours.success).toBe('#5CC38A')
    expect(darkTheme.colours.successBg).toBe('rgba(92, 195, 138, 0.12)')
    expect(darkTheme.colours.warning).toBe('#F0B04E')
    expect(darkTheme.colours.warningBg).toBe('rgba(240, 176, 78, 0.12)')
    expect(darkTheme.colours.error).toBe('#FF7D85')
    expect(darkTheme.colours.errorBg).toBe('rgba(255, 125, 133, 0.12)')
    expect(darkTheme.colours.info).toBe('#69B1FF')
    expect(darkTheme.colours.infoBg).toBe('rgba(105, 177, 255, 0.12)')
  })
})
