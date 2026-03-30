import { styles } from './styles'
import { TAB_ICON_SIZE } from './constants'
import type { TabBarTabItem } from './types'
import { AppIcon } from '@/shared/ui/icons/Icons'
import { useUnistyles } from 'react-native-unistyles'
import { Text, TouchableOpacity, View } from 'react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useCustomTabBar } from '../use-custom-tab-bar/useCustomTabBar'

export const CustomTabBar = ({
  state,
  descriptors,
  navigation
}: BottomTabBarProps) => {
  const { theme } = useUnistyles()
  const { tabs } = useCustomTabBar({ state, descriptors })
  const activeRoute = state.routes[state.index]

  if (activeRoute?.name === 'upload') {
    return null
  }

  const renderTab = (item: TabBarTabItem) => {
    const handlePress = () => {
      navigation.navigate(item.routeName)
    }
    const tabStyle = styles.tab

    const labelColourStyle = item.focused
      ? styles.tabLabelActive
      : styles.tabLabelInactive

    const iconColour = item.focused
      ? theme.colours.textPrimary
      : theme.colours.textSecondary

    return (
      <TouchableOpacity
      style={tabStyle}
        key={item.routeKey}
        onPress={handlePress}
        accessibilityRole="tab"
        accessibilityLabel={item.accessibilityLabel}
        accessibilityState={{ selected: item.focused }}
      >
        <AppIcon
          icon={item.icon}
          size={TAB_ICON_SIZE}
          color={iconColour}
        />

        <Text style={[styles.tabLabel, labelColourStyle]}>{item.label}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.tabBarShell} accessibilityRole="tablist">
      <View style={styles.tabBarBackground}>
        <View style={styles.tabBarRow}>{tabs.map(renderTab)}</View>
      </View>
    </View>
  )
}
