import { Alert } from 'react-native'
import { useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import type { UseUploadScreenResult } from '../../types'
import {
  getUploadAssetOutcome,
  recordFailedUpload,
  recordSuccessfulUpload
} from '@/services/persistence/upload-asset-key/uploadAssetKeyStore'
import { useUploadMutation } from '../use-upload-mutation/useUploadMutation'
import { useUploadPostActions } from '../use-upload-post-actions/useUploadPostActions'
import { useNetworkState } from '@/services/network/use-network-state/useNetworkState'
import { useSelectImageFromDevice } from '../use-select-image-from-device/useSelectImageFromDevice'
import { runUploadSubmission } from '../../upload-pipeline/runUploadSubmission'

const SUBMIT_LABEL_UPLOAD = 'Upload Photo'
const SUBMIT_LABEL_UPLOADING = 'Uploading…'

export const useUploadScreen = (): UseUploadScreenResult => {
  const network = useNetworkState()
  const mutation = useUploadMutation()
  const image = useSelectImageFromDevice()
  const postActions = useUploadPostActions()

  const resetOnBlurRef = useRef<() => void>(() => {})

  resetOnBlurRef.current = () => {
    mutation.reset()
    image.clearImage()
    image.clearPermissionOutcome()
  }

  useFocusEffect(
    useCallback(() => {
      return () => resetOnBlurRef.current()
    }, [])
  )

  const isSubmitDisabled = !image.preview || mutation.isPending

  const onUpload = useCallback(() => {
    if (!image.preview) return
    mutation.reset()

    runUploadSubmission({
      alert: Alert.alert,
      recordFailedUpload,
      preview: image.preview,
      recordSuccessfulUpload,
      isOffline: network.isOffline,
      mutateAsync: mutation.mutateAsync,
      getOutcome: getUploadAssetOutcome,
      onDuplicateTryAgain: async () => {
        mutation.reset()
        image.clearImage()
        await image.pickImage()
      },
      validationResult: image.validationResult,
      onUploadSucceeded: () => postActions.onUploadSucceeded(),
      onUploadFailed: error => postActions.onUploadFailed(error),
    })
  }, [image, mutation, network.isOffline, postActions])

  const submitLabel = mutation.isPending
    ? SUBMIT_LABEL_UPLOADING
    : SUBMIT_LABEL_UPLOAD

  const pickImage = async () => {
    mutation.reset()
    await image.pickImage()
  }

  const clearImage = () => {
    mutation.reset()
    image.clearImage()
  }

  return {
    ui: {
      submitLabel,
      isSubmitDisabled
    },
    actions: {
      onUpload,
      pickImage,
      clearImage,
      clearPermissionOutcome: image.clearPermissionOutcome
    },
    state: {
      preview: image.preview,
      isPicking: image.isPicking,
      uploadError: mutation.error,
      isUploading: mutation.isPending,
      validationResult: image.validationResult,
      permissionOutcome: image.permissionOutcome
    }
  }
}
