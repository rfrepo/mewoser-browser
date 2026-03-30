import { useState } from 'react'
import type { VoteDirection } from '@/shared/types/theCatApiDomain'
import { useVoteMutation } from '@/features/gallery/hooks/use-vote-mutation/useVoteMutation'
import { useFavouriteMutation } from '@/features/gallery/hooks/use-favourite-mutation/useFavouriteMutation'

type VoteParams = {
  imageId: string
  vote: VoteDirection
}

type FavouriteParams = {
  imageId: string
  nextValue: boolean
}

export const useGalleryCardActions = () => {
  const voteMutation = useVoteMutation()
  const favouriteMutation = useFavouriteMutation()
  const [isVotePendingLocal, setIsVotePendingLocal] = useState(false)
  const [isFavouritePendingLocal, setIsFavouritePendingLocal] = useState(false)

  const onVote = async ({ imageId, vote }: VoteParams) => {
    setIsVotePendingLocal(true)
    try {
      await voteMutation.mutateAsync({ imageId, vote })
    } finally {
      setIsVotePendingLocal(false)
    }
  }

  const onFavouriteToggle = async ({ imageId, nextValue }: FavouriteParams) => {
    setIsFavouritePendingLocal(true)
    try {
      await favouriteMutation.mutateAsync({ imageId, nextValue })
    } finally {
      setIsFavouritePendingLocal(false)
    }
  }

  return {
    onVote,
    onFavouriteToggle,
    isVotePending: voteMutation.isPending || isVotePendingLocal,
    isFavouritePending: favouriteMutation.isPending || isFavouritePendingLocal
  }
}
