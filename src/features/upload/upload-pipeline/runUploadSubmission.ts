import type { RunUploadSubmissionParams, UploadSubmissionResult } from '../types'
import { resolveUploadDuplicateGate } from './resolveUploadDuplicateGate'
import { showOfflineNotice } from './uploadSubmissionAlerts'

export const runUploadSubmission = async (
  params: RunUploadSubmissionParams
): Promise<UploadSubmissionResult> => {
  const { preview, validationResult, isOffline } = params

  if (!preview?.libraryAssetKey) return { status: 'aborted' }

  if (!validationResult.isValid) return { status: 'aborted' }
  
  if (isOffline) {
    await showOfflineNotice(params.alert)

    return { status: 'aborted' }
  }

  const key = preview.libraryAssetKey
  const gate = await resolveUploadDuplicateGate({
    alert: params.alert,
    prior: params.getOutcome(key),
    onDuplicateTryAgain: params.onDuplicateTryAgain
  })

  if (gate === 'aborted') return { status: 'aborted' }

  try {
    await params.mutateAsync({
      fileUri: preview.uri,
      fileType: preview.mimeType
    })

    params.recordSuccessfulUpload(key)
    params.onUploadSucceeded()

    return { status: 'completed' }
  } catch (error) {

    params.recordFailedUpload(key)
    params.onUploadFailed(error)
    return { status: 'error', error: error as Error }
  }
}
