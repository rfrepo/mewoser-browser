import {
  confirmAlreadyUploaded,
  confirmFailedHistory
} from './uploadSubmissionAlerts'
import { Alert } from 'react-native'
import type { UploadAssetOutcome } from '@/services/persistence/upload-asset-key/uploadAssetKeyStore'

export type ResolveUploadDuplicateGateParams = {
  prior: UploadAssetOutcome
  alert: typeof Alert.alert
  onDuplicateTryAgain: () => void | Promise<void>
}

export const resolveUploadDuplicateGate = async (
  params: ResolveUploadDuplicateGateParams
): Promise<'proceed' | 'aborted'> => {
  const { prior, alert, onDuplicateTryAgain } = params
  if (prior === 'none') return 'proceed'
  
  if (prior === 'success') {
    const proceed = await confirmAlreadyUploaded(alert)
    return proceed ? 'proceed' : 'aborted'
  }

  const choice = await confirmFailedHistory(alert)

  if (choice === 'tryAgain') {
    await onDuplicateTryAgain()
    return 'aborted'
  }

  return 'proceed'
}
