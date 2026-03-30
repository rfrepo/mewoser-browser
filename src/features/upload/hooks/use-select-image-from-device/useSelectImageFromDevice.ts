import type {
  UploadPreview,
  UploadValidationResult,
  UseUploadImageResult
} from '../../types'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { validateUploadSelection } from '../../upload-validation/uploadValidation'
import type { PermissionOutcome } from '../../permissions/domain'
import { requestPhotoLibraryAccess } from '../../permissions/requestPhotoLibraryAccess'
import { expoPhotoLibraryPermissionPort } from '../../permissions/expoPhotoLibraryPermissionPort'
import { computeLibraryAssetKey } from '../../library-asset-key/computeLibraryAssetKey'

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)}MB`
}

export const useSelectImageFromDevice = (): UseUploadImageResult => {
  const [isPicking, setIsPicking] = useState(false)
  const [validationResult, setValidationResult] =
  useState<UploadValidationResult>({ isValid: true })
  const [preview, setPreview] = useState<UploadPreview | null>(null)
  const [permissionOutcome, setPermissionOutcome] =
    useState<PermissionOutcome | null>(null)

  const pickImage = async () => {
    setIsPicking(true)
    setValidationResult({ isValid: true })

    try {
      const permission = await requestPhotoLibraryAccess(
        expoPhotoLibraryPermissionPort
      )

      if (permission !== 'granted') {
        setPermissionOutcome(permission)
        setPreview(null)
        return
      }

      setPermissionOutcome(null)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1
      })

      if (result.canceled) return
      
      const asset = result.assets[0]
      const fileSize = asset.fileSize ?? 0
      const mimeType = asset.mimeType ?? 'image/jpeg'
      const validation = validateUploadSelection({ fileSize, mimeType })
      
      setValidationResult(validation)

      if (!validation.isValid) {
        setPreview(null)
        return
      }

      const processed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      )

      setPreview({
        uri: processed.uri,
        mimeType: 'image/jpeg',
        fileSizeLabel: formatFileSize(fileSize),
        fileName: asset.fileName ?? 'feline_masterpiece.jpg',
        libraryAssetKey: computeLibraryAssetKey({
          uri: asset.uri,
          assetId: asset.assetId
        })
      })
    } finally {
      setIsPicking(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    setValidationResult({ isValid: true })
  }

  const clearPermissionOutcome = () => {
    setPermissionOutcome(null)
  }

  return {
    preview,
    isPicking,
    pickImage,
    clearImage,
    validationResult,
    permissionOutcome,
    clearPermissionOutcome,
  }
}
