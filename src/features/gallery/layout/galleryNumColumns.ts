import { computeGalleryNumColumns } from './computeGalleryGrid'

export const PORTRAIT_MIN_CARD_WIDTH = 170

type ResolveGalleryNumColumnsParams = {
  gap: number
  isLandscape: boolean
  paddingLeft: number
  paddingRight: number
  screenWidth: number
}

export const resolveGalleryNumColumns = ({
  gap,
  screenWidth,
  isLandscape,
  paddingLeft,
  paddingRight
}: ResolveGalleryNumColumnsParams) => {
  if (isLandscape) {
    if (screenWidth <= 320) return 1
    return 4
  }

  return computeGalleryNumColumns({
    gap,
    screenWidth,
    paddingLeft,
    paddingRight,
    maxColumns: 2,
    minItemWidth: PORTRAIT_MIN_CARD_WIDTH,
  })
}
