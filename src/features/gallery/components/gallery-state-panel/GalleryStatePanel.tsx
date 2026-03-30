import type { GalleryStatePanelProps } from '../../types'
import { GalleryErrorState } from './components/gallery-error-state/GalleryErrorState'
import { GalleryEmptyState } from './components/gallery-empty-state/GalleryEmptyState'
import { GalleryOfflineState } from './components/gallery-offline-state/GalleryOfflineState'
import { GalleryLoadingSkeleton } from './components/gallery-loading-skeleton/GalleryLoadingSkeleton'

export const GalleryStatePanel = ({ statePanel }: GalleryStatePanelProps) => {
  const { isLoading, hasError, isEmpty, isOffline, lastUpdatedLabel, onRetry, onUpload } = statePanel
  
  if (isLoading) return <GalleryLoadingSkeleton />

  if (hasError) return <GalleryErrorState onRetry={onRetry} />

  if (isEmpty) return <GalleryEmptyState onUpload={onUpload} />
  
  if (isOffline && lastUpdatedLabel) return <GalleryOfflineState lastUpdatedLabel={lastUpdatedLabel} />
  
  return null
}
