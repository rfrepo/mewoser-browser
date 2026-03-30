import { StyleSheet } from 'react-native-unistyles'
import { galleryHorizontalContentPadding } from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    ...galleryHorizontalContentPadding(theme, rt),
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginTop: theme.spacing.xs,
    color: theme.colours.textSecondary,
    fontSize: theme.typography.label
  }
}))
