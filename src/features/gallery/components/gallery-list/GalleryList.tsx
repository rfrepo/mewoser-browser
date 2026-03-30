import { styles } from './styles'
import { memo, useCallback } from 'react'
import { LegendList } from '@legendapp/list'
import { GalleryCard } from '../gallery-card/GalleryCard'
import type { CatImage } from '@/shared/types/theCatApiDomain'
import { galleryGridLayoutStyles } from '@/features/gallery/layout/galleryGridLayoutStyles'
import { useGalleryNumColumns } from '../../hooks/use-gallery-num-columns/useGalleryNumColumns'

type GalleryListProps = {
  images: CatImage[]
}

export const GalleryList = memo(function GalleryList({
  images
}: GalleryListProps) {
  const numColumns = useGalleryNumColumns()

  const renderItem = useCallback(
    ({ item }: { item: CatImage }) => <GalleryCard image={item} />,
    []
  )

  return (
    <LegendList
      data={images}
      style={styles.list}
      recycleItems={false}
      numColumns={numColumns}
      estimatedItemSize={280}
      renderItem={renderItem}
      key={String(numColumns)}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={
        numColumns > 1 ? galleryGridLayoutStyles.columnWrapper : undefined
      }
    />
  )
})
