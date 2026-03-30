import type { CatImage } from '@/shared/types/theCatApiDomain'
import type { FetchGalleryImagesParams, RemoteUserImage } from '@/services/api/the-cat-api/types'
import {
  fromRemoteUserUpload,
  mapFavouritesToItems,
  mergeGalleryFromUserAndFavourites,
  normaliseRemoteVote
} from '@/services/api/the-cat-api/theCatApiHelpers'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toApiFailureFromBaseQueryError } from './utils'
import type { CatApiBuilder } from './types'

const toError = (e: FetchBaseQueryError) =>
  ({ error: toApiFailureFromBaseQueryError(e) }) as unknown as { error: FetchBaseQueryError }

export const createGetGalleryImagesEndpoint = (builder: CatApiBuilder) =>
  builder.query<CatImage[], FetchGalleryImagesParams>({
    providesTags: (_result, _error, { installationId }) => [
      { type: 'Gallery', id: installationId }
    ],
    queryFn: async ({ installationId }, _api, _extra, fetchWithBQ) => {
      const [imagesResponse, favouritesResponse, votesResponse] = await Promise.all([
        fetchWithBQ({
          url: '/images/',
          params: {
            limit: 25,
            order: 'DESC',
            sub_id: installationId,
            include_vote: 1,
            include_favourite: 1
          }
        }),
        fetchWithBQ(
          `/favourites/?sub_id=${encodeURIComponent(
            installationId
          )}&include_vote=1`
        ),
        fetchWithBQ({
          url: '/votes',
          params: {
            sub_id: installationId,
            limit: 100,
            page: 0
          }
        })
      ])

      const userImages =
        imagesResponse.error
          ? undefined
          : ((imagesResponse.data as RemoteUserImage[]) ?? []).map(item =>
              fromRemoteUserUpload(item, installationId)
            )

      const favouriteImages =
        favouritesResponse.error
          ? undefined
          : mapFavouritesToItems((favouritesResponse.data as unknown[]) ?? [], installationId)

      const votesByImageId: Record<string, 0 | 1> =
        votesResponse.error
          ? {}
          : ((votesResponse.data as unknown[]) ?? [])
              .map(normaliseRemoteVote)
              .reduce<Record<string, 0 | 1>>((acc, v) => {
                acc[v.imageId] = v.value
                return acc
              }, {})

      const applyUserVote = (image: CatImage): CatImage => {
        const voteValue = votesByImageId[image.id]
        if (voteValue === undefined) return image

        const userVote = voteValue === 1 ? 'up' : 'down'
        const upVotes = voteValue === 1 ? 1 : 0
        const downVotes = voteValue === 0 ? 1 : 0

        return {
          ...image,
          userVote,
          upVotes,
          downVotes,
          score: upVotes - downVotes
        }
      }

      const userImagesWithVote = userImages?.map(applyUserVote) ?? undefined
      const favouriteImagesWithVote =
        favouriteImages?.map(applyUserVote) ?? undefined

      if (userImagesWithVote && favouriteImagesWithVote)
        return {
          data: mergeGalleryFromUserAndFavourites(userImagesWithVote, favouriteImagesWithVote)
        }

      if (userImagesWithVote) return { data: userImagesWithVote }
      
      if (favouriteImagesWithVote) return { data: favouriteImagesWithVote }

      return toError(
        (imagesResponse.error || favouritesResponse.error) as FetchBaseQueryError
      )
    }
  })
