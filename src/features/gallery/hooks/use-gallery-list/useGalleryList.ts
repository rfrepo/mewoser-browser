import { useNetworkState } from '@/services/network/use-network-state/useNetworkState'
import { useGetGalleryImagesQuery } from '@/services/state/catApi'
import { getInstallationIdentity } from '@/services/persistence/installation-identity/installationIdentity'
import type { UseGalleryListResult } from '../../types'

const formatTimestamp = (isoDate: string) => {
  return new Date(isoDate).toLocaleString()
}

export const useGalleryList = (): UseGalleryListResult => {
  const { isOffline } = useNetworkState()
  const { installationId } = getInstallationIdentity()
  
  const query = useGetGalleryImagesQuery({ installationId })
  
  const images = query.data ?? []
  const isLoading = query.isLoading
  const fulfilledTimeStamp = query.fulfilledTimeStamp
  
  const updatedAt = fulfilledTimeStamp
    ? formatTimestamp(new Date(fulfilledTimeStamp).toISOString())
    : ''
  
    const lastUpdatedLabel = updatedAt
    ? `Offline · Last updated ${updatedAt}`
    : ''

  return {
    images,
    isOffline: isOffline,
    isError: query.isError,
    isLoading: query.isLoading,
    refetch: () => void query.refetch(),
    isEmpty: !isLoading && images.length === 0,
    lastUpdatedLabel: isOffline ? lastUpdatedLabel : ''
  }
}
