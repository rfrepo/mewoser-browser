import type { AppIconName } from '@/shared/ui/icons/Icons'

export type TabBarTabItem = {
  label: string
  routeKey: string
  focused: boolean
  routeName: string
  icon: AppIconName
  accessibilityLabel: string
}
