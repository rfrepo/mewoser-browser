import { StyleSheet } from 'react-native-unistyles'
import { StyleSheet as RNStyleSheet } from 'react-native'

export const styles = StyleSheet.create((theme, rt) => ({
  previewTitle: {
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.title,
    color: theme.colours.textSecondary
  },
  previewMeta: {
    fontWeight: '500',
    fontSize: theme.typography.label,
    color: theme.colours.textSecondary,
  },
  previewCard: {
    alignItems: 'center',
    gap: rt.isLandscape ? theme.spacing.sm : theme.spacing.md,
    flexDirection: 'column',
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colours.surface,
  },
  previewImageContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  previewImage: {
    width: rt.isLandscape ? 80 : 96,
    height: rt.isLandscape ? 80 : 96,
    borderRadius: theme.radius.md
  },
  previewFileName: {
    fontWeight: '500',
    marginBottom: theme.spacing.xxs,
    color: theme.colours.textPrimary,
    fontSize: theme.typography.bodySmall,
  },
  removeButton: {
    flex: 1,
    minHeight: 44,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: RNStyleSheet.hairlineWidth,
    borderColor: theme.colours.borderStrong,
    backgroundColor: theme.colours.surfaceRaised,
  },
  removeLabel: {
    fontSize: theme.typography.bodySmall,
    color: theme.colours.borderStrong,
  },
  previewSeparator: {
    alignSelf: 'stretch',
    height: RNStyleSheet.hairlineWidth,
    backgroundColor: theme.colours.border,
  },
  previewFlexGrow: {
    flex: 1
  }
}))
