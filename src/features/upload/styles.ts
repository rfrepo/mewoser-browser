import { StyleSheet } from 'react-native-unistyles'
import {
  LANDSCAPE_CONTENT_MAX_WIDTH,
  uploadHorizontalContentPadding
} from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colours.bg
  },
  landscapeContentWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  scroll: {
    flex: 1,
    width: '100%',
    ...(rt.isLandscape ? { maxWidth: LANDSCAPE_CONTENT_MAX_WIDTH } : {})
  },
  scrollInner: {
    flexGrow: 1,
    ...uploadHorizontalContentPadding(theme, rt)
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.md,
    fontSize: theme.typography.body,
    paddingBottom: theme.spacing.sm,
    color: theme.colours.textSecondary
  },
  errorText: {
    fontWeight: '500',
    color: theme.colours.error,
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.bodySmall,
  },
  submitButton: {
    minHeight: 44,
    marginBottom: rt.isLandscape ? 24 : 48,
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colours.primary,
  },
  submitButtonDisabled: {
    opacity: 0.5
  },
  submitLabel: {
    color: theme.colours.textInverse,
    fontSize: theme.typography.title,
  },
  contentContainer: {
    flexGrow: 1
  }
}))
