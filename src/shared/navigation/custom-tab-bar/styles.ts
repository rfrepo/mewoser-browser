import {
  TAB_BAR_TOP_PADDING,
  TAB_LABEL_LETTER_SPACING,
  TAB_BAR_HORIZONTAL_PADDING,
  TAB_BAR_EXTRA_BOTTOM_PADDING,
} from './constants'
import { StyleSheet } from 'react-native-unistyles'

export const styles = StyleSheet.create((theme, rt) => ({
  tabBarShell: {
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: theme.shadow.tabBar.offsetY },
    shadowOpacity: theme.shadow.tabBar.opacity,
    shadowRadius: theme.shadow.tabBar.radius,
    elevation: theme.shadow.tabBar.elevation
  },
  tabBarBackground: {
    width: '100%',
    backgroundColor: theme.colours.surfaceOverlay,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colours.border,
    overflow: 'hidden'
  },
  tabBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: TAB_BAR_TOP_PADDING,
    paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
    paddingBottom: rt.insets.bottom + TAB_BAR_EXTRA_BOTTOM_PADDING
  },
  tab: {
    flex: 1,
    borderRadius: 0,
    minHeight: 48,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontWeight: '700',
    fontSize: theme.typography.label * 1.25,
    marginTop: 0,
    letterSpacing: TAB_LABEL_LETTER_SPACING,
  },
  tabLabelActive: {
    color: theme.colours.textPrimary
  },
  tabLabelInactive: {
    color: theme.colours.textSecondary
  }
}))
