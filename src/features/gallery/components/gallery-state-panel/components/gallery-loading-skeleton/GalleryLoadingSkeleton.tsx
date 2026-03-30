import { styles } from './styles'
import { View } from 'react-native'
import {
  galleryGridCellStyle,
  galleryGridLayoutStyles
} from '@/features/gallery/layout/galleryGridLayoutStyles'
import { SkeletonLoader } from '@/shared/components/skeleton-loader/SkeletonLoader'
import { useGalleryNumColumns } from '@/features/gallery/hooks/use-gallery-num-columns/useGalleryNumColumns'

const TOTAL_PLACEHOLDERS = 8

export const GalleryLoadingSkeleton = () => {
  const numColumns = useGalleryNumColumns()
  const cellStyle = galleryGridCellStyle(numColumns)

  const indices = Array.from({ length: TOTAL_PLACEHOLDERS }, (_, i) => i)
  const rows: number[][] = []
  for (let i = 0; i < indices.length; i += numColumns) {
    rows.push(indices.slice(i, i + numColumns))
  }

  return (
    <View style={styles.container}>
      {rows.map((rowIndices, rowIndex) => (
        <View key={rowIndex} style={galleryGridLayoutStyles.columnWrapper}>
          {rowIndices.map(index => (
            <SkeletonLoader
              key={index}
              style={[styles.card, cellStyle]}
              accessibilityLabel={`Loading gallery card ${index + 1}`}
            />
          ))}
        </View>
      ))}
    </View>
  )
}
