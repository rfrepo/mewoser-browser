import { createApi } from '@reduxjs/toolkit/query/react'
import { catApiBaseQuery } from '@/services/state/cat-api/catApiBaseQuery'
import { createCastVoteEndpoint } from '@/services/state/cat-api/castVoteEndpoint'
import { createUploadImageEndpoint } from '@/services/state/cat-api/uploadImageEndpoint'
import { createToggleFavouriteEndpoint } from '@/services/state/cat-api/toggleFavouriteEndpoint'
import { createGetGalleryImagesEndpoint } from '@/services/state/cat-api/getGalleryImagesEndpoint'

export const catApiSlice = createApi({
  reducerPath: 'catApi',
  tagTypes: ['Gallery'],
  keepUnusedDataFor: 60,
  baseQuery: catApiBaseQuery,
  endpoints: builder => ({
    castVote: createCastVoteEndpoint(builder),
    uploadImage: createUploadImageEndpoint(builder),
    toggleFavourite: createToggleFavouriteEndpoint(builder),
    getGalleryImages: createGetGalleryImagesEndpoint(builder),
  })
})

export const {
  useCastVoteMutation,
  useUploadImageMutation,
  useGetGalleryImagesQuery,
  useToggleFavouriteMutation,
  useLazyGetGalleryImagesQuery
} = catApiSlice
