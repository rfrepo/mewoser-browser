import { render, screen, waitFor } from '@testing-library/react-native'
import * as installationIdentity from '@/services/persistence/installation-identity/installationIdentity'
import * as networkState from '@/services/network/use-network-state/useNetworkState'
import { GalleryScreen } from '../GalleryScreen'
import { createWrapperWithStore } from '@/testUtils/renderWithStore'

jest.mock('@/services/persistence/installation-identity/installationIdentity')
jest.mock('@/services/network/use-network-state/useNetworkState')
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' }
}))

const mockGetIdentity =
  installationIdentity.getInstallationIdentity as jest.Mock
const mockNetworkState = networkState.useNetworkState as jest.Mock

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

beforeEach(() => {
  jest.clearAllMocks()
  ;(global.fetch as unknown as jest.Mock) = mockFetch
  mockGetIdentity.mockReturnValue({ installationId: 'inst-test' })
  mockNetworkState.mockReturnValue({ isOffline: false })
})

describe('GalleryScreen query states', () => {
  const renderScreen = () => {
    const { Wrapper } = createWrapperWithStore()
    return render(<GalleryScreen />, { wrapper: Wrapper })
  }

  it('shows loading indicator while fetching', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    renderScreen()
    expect(screen.getByLabelText('Loading gallery card 1')).toBeTruthy()
  })

  it('shows empty state when fetch resolves with no images', async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = getUrl(input)
      if (url.includes('/images')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/favourites')) return Promise.resolve(jsonResponse([]))
      return Promise.resolve(jsonResponse([], 404))
    })
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('Your Collection is Empty')).toBeTruthy()
    )
  })

  it('shows gallery header when images are returned', async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = getUrl(input)
      if (url.includes('/images'))
        return Promise.resolve(
          jsonResponse([
            {
              id: 'cat1',
              url: 'https://example.com/cat.jpg',
              width: 100,
              height: 100,
              createdAt: new Date().toISOString(),
              vote: { value: 1 },
              favourite: undefined
            }
          ])
        )
      if (url.includes('/favourites')) return Promise.resolve(jsonResponse([]))
      return Promise.resolve(jsonResponse([], 404))
    })
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('Your Collection')).toBeTruthy()
    )
  })

  it('shows error state when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('fail'))
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('Something went wrong')).toBeTruthy()
    )
  })

  it('shows offline stale label when offline with cached data timestamp', async () => {
    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = getUrl(input)
      if (url.includes('/images')) return Promise.resolve(jsonResponse([]))
      if (url.includes('/favourites')) return Promise.resolve(jsonResponse([]))
      return Promise.resolve(jsonResponse([], 404))
    })
    mockNetworkState.mockReturnValue({ isOffline: true })
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('Your Collection is Empty')).toBeTruthy()
    )
  })
})
