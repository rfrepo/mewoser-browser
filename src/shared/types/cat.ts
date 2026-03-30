export type VoteDirection = 'up' | 'down'

export type CatImage = {
  id: string
  score: number
  width?: number
  height?: number
  upVotes: number
  imageUrl: string
  createdAt: string
  downVotes: number
  isFavourite: boolean
  thumbnailUrl?: string
  isUserUpload: boolean
  userVote?: VoteDirection
  ownerInstallationId: string
}

export type UploadCandidate = {
  localUri: string
  mimeType: string
  fileSizeBytes: number
  compressedUri?: string
  validationErrors?: string[]
}

export type AsyncMutationStatus = 'pending' | 'succeeded' | 'failed'

type ImageAsyncMutationFields = {
  imageId: string
  status: AsyncMutationStatus
}

export type VoteMutationState = ImageAsyncMutationFields & {
  previousScore: number
  nextVote: VoteDirection
  previousVote?: VoteDirection
}

export type FavouriteMutationState = ImageAsyncMutationFields & {
  nextFavourite: boolean
  previousFavourite: boolean
}

export type ApiFailureCategory =
  | 'request_failed'
  | 'validation_error'
  | 'network_unavailable'

export type ApiFailure = {
  message: string
  category: ApiFailureCategory
}
