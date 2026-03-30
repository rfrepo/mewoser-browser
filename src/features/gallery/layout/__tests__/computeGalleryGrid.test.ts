import { computeGalleryNumColumns } from '../computeGalleryGrid'

describe('computeGalleryNumColumns', () => {
  it('returns 1 column at 340px viewport', () => {
    expect(
      computeGalleryNumColumns({
        gap: 12,
        maxColumns: 4,
        paddingLeft: 24,
        screenWidth: 340,
        paddingRight: 24,
        minItemWidth: 160
      })
    ).toBe(1)
  })

  it('returns 2 columns when there is enough width', () => {
    expect(
      computeGalleryNumColumns({
        gap: 12,
        maxColumns: 4,
        paddingLeft: 24,
        screenWidth: 390,
        paddingRight: 24,
        minItemWidth: 160
      })
    ).toBe(2)
  })

  it('returns 3 columns at larger phone widths', () => {
    expect(
      computeGalleryNumColumns({
        gap: 12,
        maxColumns: 4,
        paddingLeft: 24,
        screenWidth: 640,
        paddingRight: 24,
        minItemWidth: 180
      })
    ).toBe(3)
  })

  it('caps at maxColumns', () => {
    expect(
      computeGalleryNumColumns({
        gap: 12,
        maxColumns: 4,
        paddingLeft: 24,
        paddingRight: 24,
        screenWidth: 2000,
        minItemWidth: 160
      })
    ).toBe(4)
  })

  it('never returns less than 1 column', () => {
    expect(
      computeGalleryNumColumns({
        gap: 12,
        maxColumns: 4,
        screenWidth: 0,
        paddingLeft: 24,
        paddingRight: 24,
        minItemWidth: 160
      })
    ).toBe(1)
  })
})
