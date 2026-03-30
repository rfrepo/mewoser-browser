import { styles } from './styles'
import { Text, View } from 'react-native'
import { AppIcon } from '@/shared/ui/icons/Icons'
import { useUnistyles } from 'react-native-unistyles'
import type { UploadScreenErrorMessageProps } from '../../types'

export const UploadScreenErrorMessage = ({
  error,
  visible
}: UploadScreenErrorMessageProps) => {
  const { theme } = useUnistyles()

  if (!visible || !error) return null

  return (
    <View style={styles.container} accessibilityRole="alert">
      <View>
        <AppIcon icon="errorOutline" size={18} color={theme.colours.error} />
      </View>

      <Text style={styles.message}>{error.message}</Text>
    </View>
  )
}
