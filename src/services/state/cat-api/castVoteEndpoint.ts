import type { SetVoteParams } from '@/services/api/the-cat-api/types'
import { normaliseRemoteVote } from '@/services/api/the-cat-api/theCatApiHelpers'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toApiFailureFromBaseQueryError } from './utils'
import type { CatApiBuilder, VoteResult } from './types'

const toError = (e: FetchBaseQueryError) =>
  ({ error: toApiFailureFromBaseQueryError(e) }) as unknown as { error: FetchBaseQueryError }

const getFetchBaseQueryErrorMessage = (e: FetchBaseQueryError): string => {
  if ('error' in e && typeof e.error === 'string') return e.error
  if ('status' in e && typeof e.status === 'number') return `HTTP ${e.status}`
  return 'Request failed'
}

export const createCastVoteEndpoint = (builder: CatApiBuilder) =>
  builder.mutation<VoteResult, SetVoteParams>({
    queryFn: async ({ vote, imageId, installationId }, _api, _extra, fetchWithBQ) => {
      const installationIdShort = installationId.slice(0, 6)
      const votesResponse = await fetchWithBQ({
        url: '/votes',
        params: {
          sub_id: installationId,
          limit: 100,
          page: 0
        }
      })
      
      if (votesResponse.error) {
        return toError(votesResponse.error as FetchBaseQueryError)
      }

      const votes = ((votesResponse.data as unknown[]) ?? []).map(normaliseRemoteVote)
      const existingVote = votes.find(item => item.imageId === imageId)

      if (existingVote) {
        if (
          (existingVote.value === 1 && vote === 'up') ||
          (existingVote.value === 0 && vote === 'down')
        ) {
          return { data: { voteId: existingVote.id, imageId, vote } }
        }

        const deleteResponse = await fetchWithBQ({
          url: `/votes/${existingVote.id}`,
          method: 'DELETE'
        })

        if (deleteResponse.error) {
          return toError(deleteResponse.error)
        }
      }

      const addResponse = await fetchWithBQ({
        url: '/votes',
        method: 'POST',
        body: {
          image_id: imageId,
          sub_id: installationId,
          value: vote === 'up' ? 1 : 0
        }
      })

      if (addResponse.error) {
        return toError(addResponse.error)
      }

      const payload = addResponse.data as { id: number }

      return { data: { voteId: payload.id, imageId, vote } }
    }
  })
