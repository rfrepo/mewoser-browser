import { StyleSheet } from 'react-native-unistyles'
import { galleryHorizontalContentPadding } from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    ...galleryHorizontalContentPadding(theme, rt),
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: theme.typography.display,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    color: theme.colours.textPrimary,
    textAlign: 'center'
  },
  body: {
    fontSize: theme.typography.title,
    color: theme.colours.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md
  },
  cta: {
    backgroundColor: theme.colours.primary,
    borderRadius: theme.radius.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: theme.spacing.sm
  },
  ctaLabel: {
    color: theme.colours.textInverse,
    fontSize: theme.typography.title,
    fontWeight: '600'
  }
}))
