type ComputeGalleryNumColumnsParams = {
  gap: number
  maxColumns: number
  minItemWidth: number
  paddingLeft: number
  paddingRight: number
  screenWidth: number
}

export const computeGalleryNumColumns = ({
  gap,
  maxColumns,
  minItemWidth,
  paddingLeft,
  paddingRight,
  screenWidth
}: ComputeGalleryNumColumnsParams) => {
  const safeGap = Math.max(0, gap)
  const safeMinWidth = Math.max(1, minItemWidth)
  const safeLeft = Math.max(0, paddingLeft)
  const safeRight = Math.max(0, paddingRight)
  const safeMax = Math.max(1, Math.floor(maxColumns))

  const available = Math.max(0, screenWidth - safeLeft - safeRight)
  const columns = Math.floor((available + safeGap) / (safeMinWidth + safeGap))

  return Math.min(safeMax, Math.max(1, columns))
}
