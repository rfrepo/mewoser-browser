export type VoteDirection = 'up' | 'down'

export type CatImage = {
  id: string
  ownerInstallationId: string
  imageUrl: string
  thumbnailUrl?: string
  width?: number
  height?: number
  createdAt: string
  isFavourite: boolean
  isUserUpload: boolean
  userVote?: VoteDirection
  upVotes: number
  downVotes: number
  score: number
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
  previousVote?: VoteDirection
  previousScore: number
  nextVote: VoteDirection
}

export type FavouriteMutationState = ImageAsyncMutationFields & {
  previousFavourite: boolean
  nextFavourite: boolean
}

export type ApiFailureCategory =
  | 'validation_error'
  | 'network_unavailable'
  | 'request_failed'

export type ApiFailure = {
  category: ApiFailureCategory
  message: string
}
