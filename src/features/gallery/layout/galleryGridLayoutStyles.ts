import type { ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export const galleryGridLayoutStyles = StyleSheet.create((theme, _rt) => ({
  columnWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.sm
  }
}))

export const galleryGridCellStyle = (numColumns: number): ViewStyle => ({
  minWidth: 0,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: `${100 / numColumns}%`
})
