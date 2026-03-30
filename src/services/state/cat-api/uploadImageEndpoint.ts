import type { RemoteUploadPayload, UploadImageParams } from '@/services/api/the-cat-api/types'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { uploadImage } from '@/services/api/the-cat-api/methods/upload'
import type { CatApiBuilder } from './types'

export const createUploadImageEndpoint = (builder: CatApiBuilder) =>
  builder.mutation<RemoteUploadPayload, UploadImageParams>({
    invalidatesTags: ['Gallery'],
    queryFn: async ({ fileUri, fileType, installationId }) => {
      try {
        const data = await uploadImage({ fileUri, fileType, installationId })
        return { data }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: message
          } as FetchBaseQueryError
        }
      }
    }
  })
