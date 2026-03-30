import { StyleSheet } from 'react-native-unistyles'

const SIDE_SLOT_WIDTH = 44
const HEADER_HORIZONTAL = 12
const HEADER_PADDING_BOTTOM = 12

export const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    width: '100%',
    paddingTop: rt.insets.top + 8,
    shadowColor: theme.shadowColor,
    paddingBottom: HEADER_PADDING_BOTTOM,
    paddingLeft: HEADER_HORIZONTAL + rt.insets.left,
    paddingRight: HEADER_HORIZONTAL + rt.insets.right,
    backgroundColor: theme.colours.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: theme.shadow.screenHeader.elevation,
    shadowRadius: theme.shadow.screenHeader.radius,
    borderBottomColor: theme.colours.border,
    shadowOpacity: theme.shadow.screenHeader.opacity,
    shadowOffset: { width: 0, height: theme.shadow.screenHeader.offsetY },
  },
  wrapperTitleOnly: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleOnlyRow: {
    minHeight: SIDE_SLOT_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: SIDE_SLOT_WIDTH
  },
  sideSlot: {
    width: SIDE_SLOT_WIDTH,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colours.textPrimary,
    textAlign: 'center'
  }
}))
