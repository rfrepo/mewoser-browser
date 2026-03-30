import { useState } from 'react'
import { useStore } from 'react-redux'
import * as Haptics from 'expo-haptics'
import { useAppDispatch } from '@/store/hooks'
import type { RootState } from '@/store/index'
import type { VoteDirection } from '@/shared/types/theCatApiDomain'
import { computeVoteState } from '../../vote-rules/voteRules'
import { catApiSlice, useCastVoteMutation } from '@/services/state/catApi'
import { getInstallationIdentity } from '@/services/persistence/installation-identity/installationIdentity'

type VoteParams = {
  imageId: string
  vote: VoteDirection
}

export const useVoteMutation = () => {
  const dispatch = useAppDispatch()
  const reduxStore = useStore<RootState>()
  const [castVote] = useCastVoteMutation()
  const [isPending, setIsPending] = useState(false)
  const { installationId } = getInstallationIdentity()
  const [error, setError] = useState<Error | null>(null)

  const mutateAsync = async ({ imageId, vote }: VoteParams) => {
    const currentImages = catApiSlice.endpoints.getGalleryImages
      .select({ installationId })(reduxStore.getState())
      .data
    const previousImage = currentImages?.find(image => image.id === imageId)
    const optimisticNextImage = previousImage != null ? computeVoteState(previousImage, vote) : null
    const installationIdShort = installationId.slice(0, 6)

    setError(null)

    setIsPending(true)

    const patch =
      previousImage != null && optimisticNextImage != null
        ? dispatch(
            catApiSlice.util.updateQueryData(
              'getGalleryImages',
              { installationId },
              draft => {
                const idx = draft!.findIndex(image => image.id === imageId)
                if (idx === -1) return
                draft![idx] = {
                  ...draft![idx],
                  ...optimisticNextImage
                }
              }
            )
          )
        : null

    try {
      const result = await castVote({
        vote,
        imageId,
        installationId
      }).unwrap()
      await Haptics.selectionAsync()
      
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
    mutate: (params: VoteParams) => void mutateAsync(params).catch(() => undefined)
  }
}
