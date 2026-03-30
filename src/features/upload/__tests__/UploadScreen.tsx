import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native'
import { UploadScreen } from '../UploadScreen'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { createWrapperWithStore } from '@/testUtils/renderWithStore'
import * as installationIdentity from '@/services/persistence/installation-identity/installationIdentity'
import { resetUploadAssetKeyStoreForTests } from '@/services/persistence/upload-asset-key/uploadAssetKeyStore'
import { UPLOAD_DESTINATION_NOTICE_MESSAGE } from '../components/upload-destination-notice/uploadDestinationNoticeCopy'

jest.mock('expo-image-picker')
jest.mock('expo-image-manipulator')
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success' }
}))
jest.mock('@/services/persistence/installation-identity/installationIdentity')
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }))
jest.mock('@react-navigation/native', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  return {
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(() => {
        return cb()
        // eslint-disable-next-line react-hooks/exhaustive-deps -- test double registers blur cleanup once
      }, [])
    }
  }
})
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}))
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons'
}))
jest.mock('@/services/network/use-network-state/useNetworkState', () => ({
  useNetworkState: () => ({ isOffline: false, isConnected: true, isInternetReachable: true })
}))

const mockLaunch = ImagePicker.launchImageLibraryAsync as jest.Mock
const mockGetPermissions =
  ImagePicker.getMediaLibraryPermissionsAsync as unknown as jest.Mock
const mockRequestPermissions =
  ImagePicker.requestMediaLibraryPermissionsAsync as unknown as jest.Mock
const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock
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

beforeEach(() => {
  jest.clearAllMocks()
  resetUploadAssetKeyStoreForTests()
  ;(global.fetch as unknown as jest.Mock) = mockFetch
  mockGetIdentity.mockReturnValue({ installationId: 'inst-test' })
  mockManipulate.mockResolvedValue({ uri: 'file://compressed.jpg' })
  mockGetPermissions.mockResolvedValue({ granted: true, canAskAgain: true })
  mockRequestPermissions.mockResolvedValue({ granted: true, canAskAgain: true })
})

describe('Upload flow integration', () => {
  const renderScreen = () => {
    const { Wrapper } = createWrapperWithStore()
    return render(<UploadScreen />, { wrapper: Wrapper })
  }

  it('submit button is disabled before image is selected', () => {
    renderScreen()
    const btn = screen.getByLabelText('Upload masterpiece')
    expect(btn.props.accessibilityState?.disabled ?? btn.props.disabled).toBe(
      true
    )
  })

  it('shows validation error for unsupported file type', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://img.gif',
          mimeType: 'image/gif',
          fileSize: 100_000,
          fileName: 'cat.gif'
        }
      ]
    })
    renderScreen()
    fireEvent.press(screen.getByLabelText('Select image'))
    await waitFor(() =>
      expect(screen.getByText('Supported formats: JPG, PNG, HEIC')).toBeTruthy()
    )
  })

  it('shows validation error for file over 5MB', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://big.jpg',
          mimeType: 'image/jpeg',
          fileSize: 6 * 1024 * 1024,
          fileName: 'big.jpg'
        }
      ]
    })
    renderScreen()
    fireEvent.press(screen.getByLabelText('Select image'))
    await waitFor(() =>
      expect(screen.getByText('File must be 5MB or smaller')).toBeTruthy()
    )
  })

  it('shows preview section after valid image selection', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://cat.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024 * 1024,
          fileName: 'cat.jpg',
          assetId: 'picker-asset-1'
        }
      ]
    })
    renderScreen()
    fireEvent.press(screen.getByLabelText('Select image'))
    await waitFor(() => expect(screen.getByText('Active Preview')).toBeTruthy())
  })

  it('shows destination notice while upload is in progress', async () => {
    let resolveUpload!: (value: Response) => void
    const uploadPromise = new Promise<Response>(resolve => {
      resolveUpload = resolve
    })
    mockFetch.mockReturnValue(uploadPromise)

    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://cat.jpg',
          mimeType: 'image/jpeg',
          fileSize: 500_000,
          fileName: 'cat.jpg',
          assetId: 'picker-asset-1'
        }
      ]
    })
    renderScreen()
    fireEvent.press(screen.getByLabelText('Select image'))
    await waitFor(() => screen.getByText('Active Preview'))
    fireEvent.press(screen.getByLabelText('Upload masterpiece'))
    await waitFor(() =>
      expect(screen.getByText(UPLOAD_DESTINATION_NOTICE_MESSAGE)).toBeTruthy()
    )
    resolveUpload(
      jsonResponse({ id: 'img-1', url: 'https://cdn.example.com/cat.jpg' })
    )
    await waitFor(() =>
      expect(
        screen.queryByText(UPLOAD_DESTINATION_NOTICE_MESSAGE)
      ).toBeNull()
    )
  })

  it('shows error message on upload failure', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://cat.jpg',
          mimeType: 'image/jpeg',
          fileSize: 500_000,
          fileName: 'cat.jpg',
          assetId: 'picker-asset-1'
        }
      ]
    })
    mockFetch.mockResolvedValue(
      jsonResponse({ message: 'fail' }, 400)
    )
    renderScreen()
    fireEvent.press(screen.getByLabelText('Select image'))
    await waitFor(() => screen.getByText('Active Preview'))
    fireEvent.press(screen.getByLabelText('Upload masterpiece'))
    await waitFor(() =>
      expect(
        screen.getByText(/Upload failed \(400\): fail/)
      ).toBeTruthy()
    )
  })
})
