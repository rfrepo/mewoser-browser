import type {
  ApiFailure,
  CatImage,
} from '@/shared/types/theCatApiDomain'

import type { RemoteFavourite, RemoteUserImage } from './types'

export const parseApiFailure = (error: unknown): ApiFailure => {
  if (
    error instanceof Error &&
    (error.message.includes('Network request failed') ||
      error.name === 'ApiRequestError')
  ) {
    return {
      category: 'network_unavailable',
      message: 'No network connection. Please retry.'
    }
  }

  if (isStatusCodeError(error))
    return {
      category: 'request_failed',
      message: String(
        (error as { statusCode?: number }).statusCode ?? 'Request failed'
      )
    }

  if (error instanceof Error)
    return { category: 'request_failed', message: error.message }

  return { category: 'request_failed', message: 'Unexpected request failure.' }
}

const toSafeISOString = (value: string | number | Date | undefined): string => {
  if (value === undefined || value === null) return new Date().toISOString()
  const date = value instanceof Date ? value : new Date(value)
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

export const fromRemoteUserUpload = (
  image: RemoteUserImage,
  installationId: string
): CatImage => {
  const voteValue = image.vote?.value

  return {
    id: image.id,
    width: image.width,
    isUserUpload: true,
    imageUrl: image.url,
    height: image.height,
    thumbnailUrl: image.url,
    upVotes: voteValue === 1 ? 1 : 0,
    downVotes: voteValue === 0 ? 1 : 0,
    createdAt: toSafeISOString(image.createdAt),
    ownerInstallationId: installationId,
    isFavourite: Boolean(image.favourite),
    score: (voteValue === 1 ? 1 : 0) - (voteValue === 0 ? 1 : 0),
    userVote: voteValue === 1 ? 'up' : voteValue === 0 ? 'down' : undefined,
  }
}

export type NormalisedVote = { id: number; imageId: string; value: 0 | 1 }

export const normaliseRemoteVote = (raw: unknown): NormalisedVote => {
  const record =
    raw !== null && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : {}
  const nestedImage =
    record.image !== null && typeof record.image === 'object'
      ? (record.image as Record<string, unknown>)
      : null
  const imageId =
    record.image_id ?? record.imageId ?? nestedImage?.id
  const value = record.value
  const n = typeof value === 'number' ? value : Number(value)
  return {
    id: Number(record.id),
    imageId: typeof imageId === 'string' ? imageId : String(imageId ?? ''),
    value: n === 1 ? 1 : 0
  }
}

export const normaliseRemoteFavourite = (raw: unknown): RemoteFavourite => {
  const record =
    raw !== null && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : {}
  const imageId = record.image_id ?? record.imageId
  const subId = record.sub_id ?? record.subId
  const createdAt = record.created_at ?? record.createdAt
  return {
    id: Number(record.id),
    imageId: typeof imageId === 'string' ? imageId : String(imageId ?? ''),
    subId:
      subId === undefined || subId === null ? undefined : String(subId),
    createdAt:
      createdAt === undefined || createdAt === null
        ? undefined
        : String(createdAt),
    image: record.image as RemoteFavourite['image']
  }
}

export const fromRemoteFavourite = (
  fav: RemoteFavourite,
  installationId: string
): CatImage => ({
  score: 0,
  upVotes: 0,
  downVotes: 0,
  id: fav.imageId,
  width: undefined,
  height: undefined,
  isFavourite: true,
  isUserUpload: false,
  userVote: undefined,
  imageUrl: fav.image?.url ?? '',
  thumbnailUrl: fav.image?.url ?? '',
  ownerInstallationId: installationId,
  createdAt: toSafeISOString(fav.createdAt)
})

export const mapFavouritesToItems = (
  favourites: unknown[],
  installationId: string
): CatImage[] =>
  favourites
    .map(normaliseRemoteFavourite)
    .filter(fav => Boolean(fav.image?.url) && Boolean(fav.imageId))
    .map(fav => fromRemoteFavourite(fav, installationId))

const mergeUniqueByImageId = (
  userImages: CatImage[],
  favouriteImages: CatImage[]
): CatImage[] => {
  const mergedById = new Map<string, CatImage>()

  for (const image of userImages) mergedById.set(image.id, image)

  for (const image of favouriteImages) {
    const existing = mergedById.get(image.id)
    if (existing) {
      mergedById.set(image.id, {
        ...existing,
        isFavourite: true,
        imageUrl: existing.imageUrl || image.imageUrl,
        thumbnailUrl: existing.thumbnailUrl || image.thumbnailUrl,
        createdAt: existing.createdAt || image.createdAt
      })
    } else {
      mergedById.set(image.id, image)
    }
  }

  return Array.from(mergedById.values())
}

export const mergeGalleryFromUserAndFavourites = (
  userImages: CatImage[],
  favouriteImages: CatImage[]
): CatImage[] => mergeUniqueByImageId(userImages, favouriteImages)

const isStatusCodeError = (error: unknown): error is { statusCode?: number } =>
  error !== null &&
  typeof error === 'object' &&
  'statusCode' in error &&
  typeof (error as { statusCode?: number }).statusCode === 'number'
