import type { AppIconName } from '@/shared/ui/icons/Icons'
import type { TabBarTabItem } from '../custom-tab-bar/types'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'

const routeNameToIcon: Record<string, AppIconName> = {
  index: 'home',
  upload: 'upload',
  gallery: 'gallery',
}

const resolveIcon = (routeName: string): AppIconName =>
  routeNameToIcon[routeName] ?? 'home'

export const useCustomTabBar = ({
  state,
  descriptors
}: Pick<BottomTabBarProps, 'state' | 'descriptors'>) => {
  const tabs: TabBarTabItem[] = state.routes.map((route, index) => {
    const focused = state.index === index
    const descriptor = descriptors[route.key]
    const rawLabel =
      typeof descriptor.options.tabBarLabel === 'string'
        ? descriptor.options.tabBarLabel
        : (descriptor.options.title ?? route.name)
    const label = String(rawLabel)
   
    return {
      label,
      focused,
      routeKey: route.key,
      routeName: route.name,
      icon: resolveIcon(route.name),
      accessibilityLabel: `${label} tab`
    }
  })

  return { tabs }
}
