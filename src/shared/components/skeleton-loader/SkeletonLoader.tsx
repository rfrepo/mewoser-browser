import { StyleSheet, View } from 'react-native'
import SmartPlaceholder from 'react-native-smart-placeholder'
import { useUnistyles } from 'react-native-unistyles'
import type { StyleProp, ViewStyle } from 'react-native'

type SkeletonLoaderProps = {
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}

export const SkeletonLoader = ({ style, accessibilityLabel }: SkeletonLoaderProps) => {
  const { theme } = useUnistyles()
  const flat = StyleSheet.flatten(style) as ViewStyle | undefined
  const height = typeof flat?.height === 'number' ? flat.height : 120
  const width =
    typeof flat?.width === 'number' || typeof flat?.width === 'string' ? flat.width : '100%'
  const borderRadius = typeof flat?.borderRadius === 'number' ? flat.borderRadius : 8

  const placeholder = (
    <SmartPlaceholder
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={theme.colours.surfaceMuted}
      animationColor={theme.colours.surfaceOverlay}
      animationStyle="linear"
      style={accessibilityLabel ? { width: '100%', height } : style}
    />
  )

  if (!accessibilityLabel) {
    return placeholder
  }

  return (
    <View style={style} accessibilityLabel={accessibilityLabel} accessible>
      {placeholder}
    </View>
  )
}
