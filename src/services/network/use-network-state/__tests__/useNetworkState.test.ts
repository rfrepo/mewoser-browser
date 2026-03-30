import { act, renderHook } from '@testing-library/react-native'
import NetInfo from '@react-native-community/netinfo'
import { useNetworkState } from '../useNetworkState'

jest.mock('@react-native-community/netinfo', () => {
  const mockFn = jest.fn()
  return { default: { addEventListener: mockFn }, addEventListener: mockFn }
})

const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>

describe('useNetworkState', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns offline true when netinfo emits disconnected state', () => {
    let capturedListener:
      | ((state: {
          isConnected: boolean
          isInternetReachable: boolean
        }) => void)
      | undefined
    ;(mockNetInfo.addEventListener as jest.Mock).mockImplementation(
      listener => {
        capturedListener = listener
        return jest.fn()
      }
    )

    const { result } = renderHook(() => useNetworkState())

    act(() => {
      capturedListener?.({ isConnected: false, isInternetReachable: false })
    })

    expect(result.current.isOffline).toBe(true)
  })

  it('returns offline false when netinfo emits connected state', () => {
    let capturedListener:
      | ((state: {
          isConnected: boolean
          isInternetReachable: boolean
        }) => void)
      | undefined
    ;(mockNetInfo.addEventListener as jest.Mock).mockImplementation(
      listener => {
        capturedListener = listener
        return jest.fn()
      }
    )

    const { result } = renderHook(() => useNetworkState())

    act(() => {
      capturedListener?.({ isConnected: true, isInternetReachable: true })
    })

    expect(result.current.isOffline).toBe(false)
  })
})
