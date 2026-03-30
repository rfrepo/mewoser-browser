import { styles } from './styles'
import { Text, View } from 'react-native'
import type { GalleryOfflineStateProps } from '../../../../types'

export const GalleryOfflineState = ({ lastUpdatedLabel }: GalleryOfflineStateProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{lastUpdatedLabel}</Text>
  </View>
)
