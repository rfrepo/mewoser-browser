import type { AppTheme } from '@/shared/theme/themes'

export const LANDSCAPE_CONTENT_MAX_WIDTH = 960

type InsetsRuntime = {
  isLandscape: boolean
  insets: { left: number; right: number }
}

type LayoutWidthRuntime = {
  isLandscape: boolean
  screen: { width: number }
}

export const contentWidthForLayout = (rt: LayoutWidthRuntime) => {
  if (!rt.isLandscape) return rt.screen.width
  return Math.min(rt.screen.width, LANDSCAPE_CONTENT_MAX_WIDTH)
}

export const galleryHorizontalContentPadding = (theme: AppTheme, rt: InsetsRuntime) => {
  const base = rt.isLandscape ? theme.spacing.sm : theme.spacing.md
  return {
    paddingLeft: base + rt.insets.left,
    paddingRight: base + rt.insets.right
  }
}

export const uploadHorizontalContentPadding = (theme: AppTheme, rt: InsetsRuntime) => {
  const base = rt.isLandscape ? theme.spacing.xl : theme.spacing.md
  return {
    paddingLeft: base + rt.insets.left,
    paddingRight: base + rt.insets.right
  }
}
