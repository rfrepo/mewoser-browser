import { iconMap } from './iconMap'
import type { AppIconName } from './types'
import { useUnistyles } from 'react-native-unistyles'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

type AppIconProps = {
  size?: number
  color?: string
  icon: AppIconName
}

export const AppIcon = ({ icon, size = 20, color }: AppIconProps) => {
  const config = iconMap[icon]
  const { theme } = useUnistyles()
  const resolvedColour = color ?? theme.colours.textPrimary

  if (config.library === 'material') {
    return (
      <MaterialIcons
        size={size}
        color={resolvedColour}
        name={config.name as never}
      />
    )
  }

  return (
    <MaterialCommunityIcons
      size={size}
      color={resolvedColour}
      name={config.name as never}
    />
  )
}
