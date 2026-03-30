import { Alert } from 'react-native'
import type { FailedDuplicateChoice } from '../types'

export const showOfflineNotice = (alertFn: typeof Alert.alert) =>
  new Promise<void>(resolve => {
    alertFn(
      'Offline',
      'Connect to the internet to upload images.',
      [{ text: 'OK', onPress: () => resolve() }]
    )
  })

export const confirmAlreadyUploaded = (alertFn: typeof Alert.alert) =>
  new Promise<boolean>(resolve => {
    alertFn(
      'Already uploaded',
      'This photo was already uploaded from this app.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Upload anyway', onPress: () => resolve(true) }
      ]
    )
  })

export const confirmFailedHistory = (alertFn: typeof Alert.alert) =>
  new Promise<FailedDuplicateChoice>(resolve => {
    alertFn(
      'Previous upload failed',
      'A previous upload attempt for this photo failed.',
      [
        { text: 'Try another image', onPress: () => resolve('tryAgain') },
        { text: 'Upload anyway', onPress: () => resolve('uploadAnyway') }
      ]
    )
  })
