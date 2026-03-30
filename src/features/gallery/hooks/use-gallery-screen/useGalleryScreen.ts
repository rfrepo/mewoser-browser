import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import type { GalleryStatePanelState, UseGalleryScreenResult } from '../../types'
import { useGalleryList } from '../use-gallery-list/useGalleryList'

export const useGalleryScreen = (): UseGalleryScreenResult => {
  const router = useRouter()
  const { images, isLoading, isError, isEmpty, isOffline, lastUpdatedLabel, refetch } = useGalleryList()

  const hasList = useMemo(() => images.length > 0, [images.length])

  const statePanel = useMemo((): GalleryStatePanelState => ({
    isLoading,
    hasError: isError,
    isEmpty,
    isOffline,
    lastUpdatedLabel,
    onRetry: refetch,
    onUpload: () => router.push('/upload')
  }), [isLoading, isError, isEmpty, isOffline, lastUpdatedLabel, refetch, router])

  return { images, hasList, statePanel }
}
