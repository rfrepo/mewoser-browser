import type { CatImage } from '@/shared/types/theCatApiDomain'

export type GalleryCardProps = {
  image: CatImage
}

export type GalleryStatePanelState = {
  isLoading: boolean
  hasError: boolean
  isEmpty: boolean
  isOffline: boolean
  lastUpdatedLabel: string
  onRetry: () => void
  onUpload: () => void
}

export type GalleryStatePanelProps = {
  statePanel: GalleryStatePanelState
}

export type GalleryErrorStateProps = {
  onRetry: () => void
}

export type GalleryEmptyStateProps = {
  onUpload: () => void
}

export type GalleryOfflineStateProps = {
  lastUpdatedLabel: string
}

export type UseGalleryScreenResult = {
  images: CatImage[]
  hasList: boolean
  statePanel: GalleryStatePanelState
}

export type UseGalleryListResult = {
  images: CatImage[]
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  isOffline: boolean
  refetch: () => void
  lastUpdatedLabel: string
}
