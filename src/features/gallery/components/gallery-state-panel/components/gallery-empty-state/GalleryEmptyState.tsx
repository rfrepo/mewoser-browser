import { Pressable, Text, View } from 'react-native'
import type { GalleryEmptyStateProps } from '../../../../types'
import { styles } from './styles'

const CTA_LABEL = 'Upload a Cat'
const TITLE = 'Your Collection is Empty'
const CTA_ACCESSIBILITY_LABEL = 'Upload a Cat'
const BODY =
  'Start building your gallery by uploading your own feline masterpieces or favoriting cats you discover.'

export const GalleryEmptyState = ({ onUpload }: GalleryEmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{TITLE}</Text>

    <Text style={styles.body}>{BODY}</Text>

    <Pressable
      style={styles.cta}
      onPress={onUpload}
      accessibilityLabel={CTA_ACCESSIBILITY_LABEL}
    >
      <Text style={styles.ctaLabel}>{CTA_LABEL}</Text>
    </Pressable>
  </View>
)
