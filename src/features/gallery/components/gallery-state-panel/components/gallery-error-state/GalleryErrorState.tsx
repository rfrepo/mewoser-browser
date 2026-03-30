import { styles } from './styles'
import { Pressable, Text, View } from 'react-native'
import type { GalleryErrorStateProps } from '../../../../types'

const CTA_LABEL = 'Retry'
const TITLE = 'Something went wrong'
const CTA_ACCESSIBILITY_LABEL = 'Retry loading gallery'
const BODY = 'We could not load your gallery. Try again.'

export const GalleryErrorState = ({ onRetry }: GalleryErrorStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{TITLE}</Text>

    <Text style={styles.body}>{BODY}</Text>

    <Pressable
      style={styles.cta}
      onPress={onRetry}
      accessibilityLabel={CTA_ACCESSIBILITY_LABEL}
    >
      <Text style={styles.ctaLabel}>{CTA_LABEL}</Text>
    </Pressable>
  </View>
)
