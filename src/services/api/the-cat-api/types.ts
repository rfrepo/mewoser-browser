import type { VoteDirection } from '@/shared/types/theCatApiDomain'
export type RemoteUserImage = {
  id: string
  url: string
  width: number
  height: number
  createdAt: string | number | Date
  vote?: { id: number; imageId: string; value: 0 | 1 } | null
  favourite?: { id: number } | null
}

export type RemoteFavourite = {
  id: number
  imageId: string
  subId?: string
  createdAt?: string
  image?: { url?: string } | null
}

export type RemoteUploadPayload = {
  id: string
  url: string
}

type WithInstallationId = { installationId: string }

export type FetchGalleryImagesParams = WithInstallationId

export type UploadImageParams = WithInstallationId & {
  fileUri: string
  fileType: string
}

export type SetFavouriteParams = WithInstallationId & {
  imageId: string
  isFavourite: boolean
}

export type SetVoteParams = WithInstallationId & {
  imageId: string
  vote: VoteDirection
}
