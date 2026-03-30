import { act, renderHook, waitFor } from '@testing-library/react-native'
import * as installationIdentity from '@/services/persistence/installation-identity/installationIdentity'
import type { CatImage } from '@/shared/types/theCatApiDomain'
import { useVoteMutation } from '../useVoteMutation'
import { createWrapperWithStore } from '@/testUtils/renderWithStore'
import { catApiSlice } from '@/services/state/catApi'

jest.mock('expo-haptics', () => ({ selectionAsync: jest.fn() }))
jest.mock('@/services/persistence/installation-identity/installationIdentity')

const mockGetIdentity =
  installationIdentity.getInstallationIdentity as jest.Mock
const mockFetch = jest.fn()
const jsonResponse = (data: unknown, status = 200) => {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify(data),
    clone() {
      return response
    }
  }
  return response as unknown as Response
}
const getUrl = (input: RequestInfo | URL) =>
  typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
const getMethod = (input: RequestInfo | URL, init?: RequestInit) =>
  init?.method ?? (typeof input === 'object' && 'method' in input ? (input.method as string | undefined) : undefined)

const INSTALLATION_ID = 'test-inst-002'

const makeCatImage = (override: Partial<CatImage> = {}): CatImage => ({
  id: 'cat1',
  ownerInstallationId: INSTALLATION_ID,
  imageUrl: 'https://example.com/cat.jpg',
  thumbnailUrl: 'https://example.com/cat.jpg',
  createdAt: new Date().toISOString(),
  isFavourite: false,
  isUserUpload: false,
  upVotes: 2,
  downVotes: 1,
  score: 1,
  ...override
})

describe('useVoteMutation', () => {
  const setup = () => {
    const { store, Wrapper } = createWrapperWithStore()
    return { store, Wrapper }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as unknown as jest.Mock) = mockFetch
    mockGetIdentity.mockReturnValue({ installationId: INSTALLATION_ID })
  })

  it('optimistically updates score on upvote', async () => {
    const image = makeCatImage({ upVotes: 0, score: 0 })
    const { store, Wrapper } = setup()
    mockFetch.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = getUrl(input)
      const method = getMethod(input, init)
      if (url.includes('/images'))
        return Promise.resolve(
          jsonResponse([
            {
              id: image.id,
              url: image.imageUrl,
              width: 100,
              height: 100,
              createdAt: image.createdAt,
              vote: undefined,
              favourite: undefined
            }
          ])
        )
      if (url.includes('/favourites')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/votes?')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/votes') && method === 'POST')
        return Promise.resolve(jsonResponse({ id: 1, message: 'SUCCESS' }))
      return Promise.resolve(jsonResponse([], 404))
    })
    await store
      .dispatch(
        catApiSlice.endpoints.getGalleryImages.initiate({
          installationId: INSTALLATION_ID
        })
      )
      .unwrap()

    const { result } = renderHook(() => useVoteMutation(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ imageId: 'cat1', vote: 'up' })
    })

    await waitFor(() => {
      const cached = catApiSlice.endpoints.getGalleryImages
        .select({ installationId: INSTALLATION_ID })(store.getState())
        .data?.find(item => item.id === 'cat1')
      expect(cached?.upVotes).toBe(1)
      expect(cached?.score).toBe(1)
    })
  })

  it('rolls back score on API failure', async () => {
    const image = makeCatImage({ upVotes: 0, downVotes: 0, score: 0 })
    const { store, Wrapper } = setup()
    mockFetch.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = getUrl(input)
      const method = getMethod(input, init)
      if (url.includes('/images'))
        return Promise.resolve(
          jsonResponse([
            {
              id: image.id,
              url: image.imageUrl,
              width: 100,
              height: 100,
              createdAt: image.createdAt,
              vote: undefined,
              favourite: undefined
            }
          ])
        )
      if (url.includes('/favourites')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/votes?')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/votes') && method === 'POST')
        return Promise.resolve(jsonResponse({ message: 'Network request failed' }, 500))
      return Promise.resolve(jsonResponse([], 404))
    })
    await store
      .dispatch(
        catApiSlice.endpoints.getGalleryImages.initiate({
          installationId: INSTALLATION_ID
        })
      )
      .unwrap()

    const { result } = renderHook(() => useVoteMutation(), { wrapper: Wrapper })

    act(() => {
      result.current.mutate({ imageId: 'cat1', vote: 'up' })
    })

    await waitFor(() => {
      const cached = catApiSlice.endpoints.getGalleryImages
        .select({ installationId: INSTALLATION_ID })(store.getState())
        .data?.find(item => item.id === 'cat1')
      expect(cached?.score).toBe(0)
    })
  })
})
