import { StyleSheet } from 'react-native-unistyles'
import { galleryHorizontalContentPadding } from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    gap: theme.spacing.sm,
    ...galleryHorizontalContentPadding(theme, rt),
    paddingVertical: theme.spacing.lg
  },
  card: {
    height: 180,
    borderRadius: theme.radius.md
  }
}))
