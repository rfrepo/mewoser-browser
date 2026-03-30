import type { FetchGalleryImagesParams, RemoteFavourite, RemoteUserImage } from '../types'
import type { CatImage } from '@/shared/types/theCatApiDomain'
import {
  parseApiFailure,
  fromRemoteUserUpload,
  mapFavouritesToItems,
  mergeGalleryFromUserAndFavourites,
  normaliseRemoteVote
} from '../theCatApiHelpers'

const THE_CAT_API_KEY = process.env.EXPO_PUBLIC_THE_CAT_API_KEY ?? ''

const toQueryString = (params: Record<string, string | number>) =>
  new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {})
  ).toString()

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'x-api-key': THE_CAT_API_KEY
    }
  })
  const raw = await response.text()
  if (!response.ok) throw new Error(`Request failed: ${response.status} ${raw}`)
  return (raw ? JSON.parse(raw) : []) as T
}

const fetchUserUploads = async (installationId: string) => {
  const query = toQueryString({
    limit: 25,
    order: 'DESC',
    sub_id: installationId,
    include_vote: 1,
    include_favourite: 1
  })

  const userImages = await fetchJson<RemoteUserImage[]>(
    `https://api.thecatapi.com/v1/images?${query}`
  )

  return userImages.map(item => fromRemoteUserUpload(item, installationId))
}

const fetchFavouritedUploads = async (installationId: string) => {
  const query = toQueryString({ sub_id: installationId, include_vote: 1 })
  const favourites = await fetchJson<RemoteFavourite[]>(
    `https://api.thecatapi.com/v1/favourites?${query}`
  )
  return mapFavouritesToItems(favourites, installationId)
}

const fetchVotesBySubId = async (
  installationId: string
): Promise<Record<string, 0 | 1>> => {
  const query = toQueryString({ sub_id: installationId, limit: 100, page: 0 })
  const votesRaw = await fetchJson<unknown[]>(
    `https://api.thecatapi.com/v1/votes?${query}`
  )
  return votesRaw
    .map(normaliseRemoteVote)
    .reduce<Record<string, 0 | 1>>((acc, v) => {
      acc[v.imageId] = v.value
      return acc
    }, {})
}

const applyUserVote = (
  image: CatImage,
  votesByImageId: Record<string, 0 | 1>
): CatImage => {
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

const buildGalleryFromSources = async (installationId: string) => {
  const [userImagesResult, favouriteImagesResult, votesResult] =
    await Promise.allSettled([
      fetchUserUploads(installationId),
      fetchFavouritedUploads(installationId),
      fetchVotesBySubId(installationId)
    ])

  if (
    userImagesResult.status === 'fulfilled' &&
    favouriteImagesResult.status === 'fulfilled'
  ) {
    const votesByImageId = votesResult.status === 'fulfilled' ? votesResult.value : {}

    return mergeGalleryFromUserAndFavourites(
      userImagesResult.value.map(image => applyUserVote(image, votesByImageId)),
      favouriteImagesResult.value.map(image => applyUserVote(image, votesByImageId))
    )
  }

  if (userImagesResult.status === 'fulfilled') {
    const votesByImageId = votesResult.status === 'fulfilled' ? votesResult.value : {}
    return userImagesResult.value.map(image => applyUserVote(image, votesByImageId))
  }

  if (favouriteImagesResult.status === 'fulfilled') {
    const votesByImageId = votesResult.status === 'fulfilled' ? votesResult.value : {}
    return favouriteImagesResult.value.map(image => applyUserVote(image, votesByImageId))
  }

  throw userImagesResult.reason ?? favouriteImagesResult.reason
}

const fetchGalleryImages = async ({ installationId }: FetchGalleryImagesParams) => {
  try {
    return await buildGalleryFromSources(installationId)
  } catch (error) {
    throw parseApiFailure(error)
  }
}

const mockFetch = jest.fn()

const asJsonResponse = (value: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    text: async () => JSON.stringify(value),
  }) as any

describe('The Cat API gallery mapping', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    ;(globalThis as any).fetch = mockFetch
  })

  it('should map image payload into cat image model', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/images'))
        return asJsonResponse([
          {
            id: 'img_1',
            url: 'https://example.com/cat.jpg',
            width: 100,
            height: 200,
            createdAt: new Date().toISOString(),
            vote: undefined,
            favourite: undefined
          }
        ])
      if (url.includes('/favourites')) return asJsonResponse([])
      return asJsonResponse([], true, 200)
    })

    const result = await fetchGalleryImages({ installationId: 'inst_1' })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'img_1',
      ownerInstallationId: 'inst_1',
      imageUrl: 'https://example.com/cat.jpg',
      score: 0,
      isUserUpload: true
    })
  })

  it('keeps isUserUpload when an upload is also a favourite', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/images'))
        return asJsonResponse([
          {
            id: 'same',
            url: 'https://example.com/up.jpg',
            width: 1,
            height: 1,
            createdAt: new Date().toISOString(),
            vote: undefined,
            favourite: { id: 1 }
          }
        ])
      if (url.includes('/favourites'))
        return asJsonResponse([
          {
            id: 1,
            imageId: 'same',
            image: { url: 'https://example.com/up.jpg' },
            createdAt: '2026-01-03T00:00:00.000Z'
          }
        ])
      return asJsonResponse([], true, 200)
    })

    const result = await fetchGalleryImages({ installationId: 'inst_1' })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'same',
      isFavourite: true,
      isUserUpload: true
    })
  })

  it('maps snake_case favourite payloads from the API', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/images')) return asJsonResponse([])
      if (url.includes('/favourites'))
        return asJsonResponse([
          {
            id: 9,
            image_id: 'fav_snake',
            image: { url: 'https://example.com/fav.jpg' },
            created_at: '2026-01-02T00:00:00.000Z'
          }
        ])
      return asJsonResponse([], true, 200)
    })

    const result = await fetchGalleryImages({ installationId: 'inst_1' })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'fav_snake',
      isFavourite: true,
      isUserUpload: false
    })
  })

  it('marks favourite-only images as not user uploads', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/images')) return asJsonResponse([])
      if (url.includes('/favourites'))
        return asJsonResponse([
          {
            id: 9,
            imageId: 'fav_1',
            image: { url: 'https://example.com/fav.jpg' },
            createdAt: '2026-01-02T00:00:00.000Z'
          }
        ])
      return asJsonResponse([], true, 200)
    })

    const result = await fetchGalleryImages({ installationId: 'inst_1' })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: 'fav_1',
      isFavourite: true,
      isUserUpload: false
    })
  })

  it('should map non-ok response to request_failed category', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/images')) throw new Error('request failed')
      if (url.includes('/favourites')) throw new Error('request failed')
      return asJsonResponse([], true, 200)
    })

    await expect(
      fetchGalleryImages({ installationId: 'inst_1' })
    ).rejects.toMatchObject({
      category: 'request_failed'
    })
  })
})
