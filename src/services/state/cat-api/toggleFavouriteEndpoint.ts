import type { SetFavouriteParams } from '@/services/api/the-cat-api/types'
import { normaliseRemoteFavourite } from '@/services/api/the-cat-api/theCatApiHelpers'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toApiFailureFromBaseQueryError } from './utils'
import type { CatApiBuilder, FavouriteResult } from './types'

const toError = (e: FetchBaseQueryError) =>
  ({ error: toApiFailureFromBaseQueryError(e) }) as unknown as { error: FetchBaseQueryError }

export const createToggleFavouriteEndpoint = (builder: CatApiBuilder) =>
  builder.mutation<FavouriteResult, SetFavouriteParams>({
    queryFn: async ({ imageId, isFavourite, installationId }, _api, _extra, fetchWithBQ) => {
      if (isFavourite) {
        const addResponse = await fetchWithBQ({
          url: '/favourites',
          method: 'POST',
          body: { image_id: imageId, sub_id: installationId }
        })
        if (addResponse.error) return toError(addResponse.error as FetchBaseQueryError)

        return { data: { imageId, isFavourite: true } }
      }

      const favouritesResponse = await fetchWithBQ(
        `/favourites?sub_id=${encodeURIComponent(installationId)}`
      )
      if (favouritesResponse.error) return toError(favouritesResponse.error as FetchBaseQueryError)

      const rawList = (favouritesResponse.data as unknown[]) ?? []
      const favourites = rawList.map(normaliseRemoteFavourite)
      const existingFavourite = favourites.find(item => item.imageId === imageId)

      if (existingFavourite) {
        const deleteResponse = await fetchWithBQ({
          url: `/favourites/${existingFavourite.id}`,
          method: 'DELETE'
        })
        if (deleteResponse.error) return toError(deleteResponse.error as FetchBaseQueryError)
      }

      return { data: { imageId, isFavourite: false } }
    }
  })
