import type { EndpointBuilder } from '@reduxjs/toolkit/query'
import type { VoteDirection } from '@/shared/types/theCatApiDomain'
import { catApiBaseQuery } from './catApiBaseQuery'

export type CatApiBuilder = EndpointBuilder<typeof catApiBaseQuery, 'Gallery', 'catApi'>

export type VoteResult = { voteId: number; imageId: string; vote: VoteDirection }
export type FavouriteResult = { imageId: string; isFavourite: boolean }
