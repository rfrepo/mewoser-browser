import { styles } from './styles'
import { View } from 'react-native'
import { GalleryList } from './components/gallery-list/GalleryList'
import { ScreenHeader } from '@/shared/components/screen-header/ScreenHeader'
import { useGalleryScreen } from './hooks/use-gallery-screen/useGalleryScreen'
import { GalleryStatePanel } from './components/gallery-state-panel/GalleryStatePanel'

const HEADER_TITLE = 'Your Collection'

export const GalleryScreen = () => {
  const { images, hasList, statePanel } = useGalleryScreen()

  return (
    <View style={styles.screen}>
      <ScreenHeader title={HEADER_TITLE} />

      <View style={styles.landscapeContentWrap}>
        <View style={styles.landscapeContentInner}>
          {hasList ? (
            <GalleryList images={images} />
          ) : (
            <GalleryStatePanel statePanel={statePanel} />
          )}
        </View>
      </View>
    </View>
  )
}
