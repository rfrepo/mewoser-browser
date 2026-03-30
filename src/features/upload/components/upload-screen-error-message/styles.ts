import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create(theme => ({
  container: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colours.error,
    backgroundColor: theme.colours.errorBg,
  },
  message: {
    flex: 1,
    color: theme.colours.textPrimary,
    fontSize: theme.typography.label,
    fontWeight: '500',
  },
}))
