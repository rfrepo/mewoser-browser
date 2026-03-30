import * as ImagePicker from 'expo-image-picker'
import type { PhotoLibraryPermissionPort } from './domain'

export const expoPhotoLibraryPermissionPort: PhotoLibraryPermissionPort = {
  get: async () => {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync()
    return { granted: current.granted, canAskAgain: current.canAskAgain }
  },
  request: async () => {
    const requested = await ImagePicker.requestMediaLibraryPermissionsAsync()
    return { granted: requested.granted, canAskAgain: requested.canAskAgain }
  }
}

