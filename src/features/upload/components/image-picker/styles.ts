import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme, rt) => ({
  pickerBox: {
    borderWidth: 1,
    minHeight: rt.isLandscape ? 160 : 200,
    alignItems: 'center',
    borderStyle: 'dashed',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    marginVertical: rt.isLandscape ? theme.spacing.md : theme.spacing.lg,
    borderColor: theme.colours.border,
    backgroundColor: theme.colours.surface
  },
  pickerLabel: {
    fontWeight: '600',
    marginTop: theme.spacing.sm,
    color: theme.colours.primary,
    marginBottom: theme.spacing.xxs,
    fontSize: theme.typography.title,
  },
  errorText: {
    fontWeight: '500',
    color: theme.colours.error,
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.bodySmall,
  },
  infoText: {
    color: theme.colours.textSecondary,
    fontSize: theme.typography.label,
  },
  iconCircle: {
    width: rt.isLandscape ? 44 : 52,
    height: rt.isLandscape ? 44 : 52,
    borderRadius: rt.isLandscape ? 22 : 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colours.surfaceRaised
  },
  icon: {
    color: theme.colours.textSecondary,
  },
}))