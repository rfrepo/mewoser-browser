import { resolveGalleryNumColumns } from '../galleryNumColumns'

const PAD = 24
const GAP = 12

describe('resolveGalleryNumColumns', () => {
  it('uses a single portrait column when two columns would be narrower than the minimum card width', () => {
    expect(
      resolveGalleryNumColumns({
        screenWidth: 390,
        isLandscape: false,
        paddingLeft: PAD,
        paddingRight: PAD,
        gap: GAP
      })
    ).toBe(1)
  })

  it('uses two portrait columns when the row is wide enough for two minimum-width cards', () => {
    expect(
      resolveGalleryNumColumns({
        screenWidth: 820,
        isLandscape: false,
        paddingLeft: PAD,
        paddingRight: PAD,
        gap: GAP
      })
    ).toBe(2)
  })

  it('returns 1 in landscape when width is at most 320', () => {
    expect(
      resolveGalleryNumColumns({
        screenWidth: 320,
        isLandscape: true,
        paddingLeft: PAD,
        paddingRight: PAD,
        gap: GAP
      })
    ).toBe(1)
  })

  it('returns 4 in landscape when width is greater than 320', () => {
    expect(
      resolveGalleryNumColumns({
        screenWidth: 800,
        isLandscape: true,
        paddingLeft: PAD,
        paddingRight: PAD,
        gap: GAP
      })
    ).toBe(4)
  })
})
