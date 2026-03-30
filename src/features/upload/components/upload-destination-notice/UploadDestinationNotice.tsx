import { styles } from './styles'
import { Text, View } from 'react-native'
import { AppIcon } from '@/shared/ui/icons/Icons'
import { useUnistyles } from 'react-native-unistyles'
import type { UploadDestinationNoticeProps } from '../../types'

const UPLOAD_DESTINATION_NOTICE_MESSAGE =
  "After upload, you'll return to the home screen to view your image."
  
export const UploadDestinationNotice = ({ visible }: UploadDestinationNoticeProps) => {
  const { theme } = useUnistyles()

  if (!visible) return null

  return (
    <View
      style={styles.container}
      accessibilityLiveRegion="polite"
    >
      <View>
        <AppIcon icon="infoOutline" size={18} color={theme.colours.info} />
      </View>

      <Text style={styles.message}>{UPLOAD_DESTINATION_NOTICE_MESSAGE}</Text>
    </View>
  )
}
