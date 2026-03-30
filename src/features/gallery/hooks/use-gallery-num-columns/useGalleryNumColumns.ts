import { useUnistyles } from 'react-native-unistyles'
import { contentWidthForLayout, galleryHorizontalContentPadding } from '@/shared/layout/contentHorizontalInset'
import { resolveGalleryNumColumns } from '@/features/gallery/layout/galleryNumColumns'

export const useGalleryNumColumns = () => {
  const { rt, theme } = useUnistyles()
  const { paddingLeft, paddingRight } = galleryHorizontalContentPadding(theme, rt)

  return resolveGalleryNumColumns({
    gap: theme.spacing.sm,
    isLandscape: rt.isLandscape,
    paddingLeft,
    paddingRight,
    screenWidth: contentWidthForLayout(rt)
  })
}
