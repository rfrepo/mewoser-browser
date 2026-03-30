import { useState } from 'react'
import { useStore } from 'react-redux'
import * as Haptics from 'expo-haptics'
import { useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store/index'
import { catApiSlice, useToggleFavouriteMutation } from '@/services/state/catApi'
import { getInstallationIdentity } from '@/services/persistence/installation-identity/installationIdentity'

type FavouriteParams = { imageId: string; nextValue: boolean }

export const useFavouriteMutation = () => {
  const dispatch = useAppDispatch()
  const reduxStore = useStore<RootState>()
  const [isPending, setIsPending] = useState(false)
  const { installationId } = getInstallationIdentity()
  const [toggleFavourite] = useToggleFavouriteMutation()
  const [error, setError] = useState<Error | null>(null)

  const mutateAsync = async (params: FavouriteParams) => {
    const currentImages = catApiSlice.endpoints.getGalleryImages
      .select({ installationId })(reduxStore.getState())
      .data

    const previousImage = currentImages?.find(image => image.id === params.imageId)
    setError(null)
    setIsPending(true)
    
    const patch = previousImage
      ? dispatch(
          catApiSlice.util.updateQueryData(
            'getGalleryImages',
            { installationId },
            draft => {
              const image = draft.find(item => item.id === params.imageId)
              if (!image) return
              image.isFavourite = params.nextValue
            }
          )
        )
      : null
    try {
      const result = await toggleFavourite({
        installationId,
        imageId: params.imageId,
        isFavourite: params.nextValue
      }).unwrap()

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } catch {}

      return result
    } catch (mutationError) {
      patch?.undo()

      const normalisedError =
        mutationError instanceof Error
          ? mutationError
          : new Error('Request failed')

      setError(normalisedError)
      
      throw normalisedError
    } finally {
      setIsPending(false)
    }
  }

  return {
    error,
    isPending,
    mutateAsync,
    reset: () => setError(null),
    mutate: (params: FavouriteParams) => {
      void mutateAsync(params).catch(() => undefined)
    }
  }
}
