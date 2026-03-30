import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import type { ScreenHeaderProps } from './types'
import { styles } from './styles'

const BACK_HIT_SLOP = 12
const BACK_ICON_SIZE = 24

export const ScreenHeader = ({ title, onBackPress }: ScreenHeaderProps) => {
  const { theme } = useUnistyles()
  const hasBack = Boolean(onBackPress)

  if (hasBack) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <View style={styles.sideSlot}>
            <Pressable
              onPress={onBackPress}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={BACK_HIT_SLOP}
            >
              <MaterialIcons
                name="arrow-back"
                size={BACK_ICON_SIZE}
                color={theme.colours.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.titleSlot} testID="screen-header-title-slot">
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
          </View>

          <View style={styles.sideSlot} />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.wrapper, styles.wrapperTitleOnly]}>
      <View style={styles.titleOnlyRow}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      </View>
    </View>
  )
}
