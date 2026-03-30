import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create(theme => ({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderColor: theme.colours.info,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colours.infoBg,
  },
  message: {
    flex: 1,
    fontWeight: '500',
    color: theme.colours.textPrimary,
    fontSize: theme.typography.label,
  },
}))
