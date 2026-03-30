import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { useSelectImageFromDevice } from '../useSelectImageFromDevice'

jest.mock('expo-image-picker')
jest.mock('expo-image-manipulator')

const mockLaunch = ImagePicker.launchImageLibraryAsync as jest.Mock
const mockGetPermissions =
  ImagePicker.getMediaLibraryPermissionsAsync as unknown as jest.Mock
const mockRequestPermissions =
  ImagePicker.requestMediaLibraryPermissionsAsync as unknown as jest.Mock
const mockManipulate = ImageManipulator.manipulateAsync as jest.Mock

describe('useSelectImageFromDevice', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockManipulate.mockResolvedValue({ uri: 'file://compressed.jpg' })
    mockGetPermissions.mockResolvedValue({ granted: true, canAskAgain: true })
    mockRequestPermissions.mockResolvedValue({ granted: true, canAskAgain: true })
  })

  it('sets preview after valid image selection', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://image.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024 * 1024,
          fileName: 'cat.jpg'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.preview).not.toBeNull()
    expect(result.current.preview?.uri).toBe('file://compressed.jpg')
    expect(result.current.preview?.libraryAssetKey).toBe('uri:file://image.jpg')
    expect(result.current.validationResult.isValid).toBe(true)
  })

  it('does not launch picker when permission is denied', async () => {
    mockGetPermissions.mockResolvedValue({ granted: false, canAskAgain: true })
    mockRequestPermissions.mockResolvedValue({ granted: false, canAskAgain: true })
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://image.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024 * 1024,
          fileName: 'cat.jpg'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())

    expect(mockLaunch).not.toHaveBeenCalled()
    expect(result.current.preview).toBeNull()
  })

  it('does not launch picker when permission is blocked', async () => {
    mockGetPermissions.mockResolvedValue({ granted: false, canAskAgain: true })
    mockRequestPermissions.mockResolvedValue({ granted: false, canAskAgain: false })
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://image.jpg',
          mimeType: 'image/jpeg',
          fileSize: 1024 * 1024,
          fileName: 'cat.jpg'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())

    expect(mockLaunch).not.toHaveBeenCalled()
    expect(result.current.preview).toBeNull()
  })

  it('rejects files over 5MB', async () => {
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

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.preview).toBeNull()
    expect(result.current.validationResult.isValid).toBe(false)
    expect(result.current.validationResult.errorCode).toBe('file_too_large')
  })

  it('rejects unsupported mime type', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://image.gif',
          mimeType: 'image/gif',
          fileSize: 100_000,
          fileName: 'cat.gif'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.preview).toBeNull()
    expect(result.current.validationResult.isValid).toBe(false)
    expect(result.current.validationResult.errorCode).toBe('invalid_type')
  })

  it('does nothing when picker is cancelled', async () => {
    mockLaunch.mockResolvedValue({ canceled: true, assets: [] })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.preview).toBeNull()
  })

  it('clears validation at the start of pickImage', async () => {
    mockLaunch.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          uri: 'file://image.gif',
          mimeType: 'image/gif',
          fileSize: 100_000,
          fileName: 'cat.gif'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.validationResult.isValid).toBe(false)

    let resolvePicker: (value: unknown) => void
    mockLaunch.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolvePicker = resolve
        })
    )
    act(() => {
      void result.current.pickImage()
    })
    expect(result.current.validationResult.isValid).toBe(true)

    await waitFor(() => expect(mockLaunch).toHaveBeenCalledTimes(2))
    await act(async () => {
      resolvePicker!({ canceled: true, assets: [] })
    })
  })

  it('clears preview and resets validation on clearImage', async () => {
    mockLaunch.mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file://image.jpg',
          mimeType: 'image/jpeg',
          fileSize: 500_000,
          fileName: 'cat.jpg'
        }
      ]
    })

    const { result } = renderHook(() => useSelectImageFromDevice())
    await act(() => result.current.pickImage())
    expect(result.current.preview).not.toBeNull()

    act(() => result.current.clearImage())
    expect(result.current.preview).toBeNull()
    expect(result.current.validationResult.isValid).toBe(true)
  })
})
