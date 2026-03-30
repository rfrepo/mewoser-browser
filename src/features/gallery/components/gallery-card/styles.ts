import { StyleSheet } from 'react-native-unistyles'

export const galleryCardActionIconSize = 16
const SCORE_SIZE = Math.round(16 * 0.8)

export const styles = StyleSheet.create((theme, rt) => ({
  cardOuter: {
    flex: 1,
    marginBottom: rt.isLandscape ? theme.spacing.lg : theme.spacing.cardStack,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colours.border,
    backgroundColor: theme.colours.surface,
    shadowColor: theme.shadowColor,
    shadowOpacity: theme.shadow.card.opacity,
    shadowRadius: theme.shadow.card.radius,
    shadowOffset: { width: 0, height: theme.shadow.card.offsetY },
    elevation: theme.shadow.card.elevation
  },
  cardInner: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colours.surface
  },
  image: {
    width: '100%',
    height: rt.isLandscape ? 160 : 220
  },
  cardFooter: {
    padding: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  voteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  actionButton: {
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  score: {
    fontSize: SCORE_SIZE,
    fontWeight: '600',
    color: theme.colours.textPrimary
  }
}))
