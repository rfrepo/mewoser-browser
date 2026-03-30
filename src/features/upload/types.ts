import type { UploadAssetOutcome } from '@/services/persistence/upload-asset-key/uploadAssetKeyStore'

export type UploadValidationErrorCode = 'invalid_type' | 'file_too_large'

export type UploadValidationResult = {
  isValid: boolean
  message?: string
  errorCode?: UploadValidationErrorCode
}

export type UploadPreview = {
  uri: string
  fileName: string
  mimeType: string
  fileSizeLabel: string
  libraryAssetKey: string
}

export type UseUploadImageResult = {
  isPicking: boolean
  clearImage: () => void
  preview: UploadPreview | null
  pickImage: () => Promise<void>
  clearPermissionOutcome: () => void
  validationResult: UploadValidationResult
  permissionOutcome: import('./permissions/domain').PermissionOutcome | null
}

export type UploadScreenState = {
  isPicking: boolean
  isUploading: boolean
  uploadError: Error | null
  preview: UploadPreview | null
  validationResult: UploadValidationResult
  permissionOutcome: import('./permissions/domain').PermissionOutcome | null
}

export type UploadScreenActions = {
  onUpload: () => void
  clearImage: () => void
  pickImage: () => Promise<void>
  clearPermissionOutcome: () => void
}

export type UploadScreenUi = {
  submitLabel: string
  isSubmitDisabled: boolean
}

export type UseUploadScreenResult = {
  ui: UploadScreenUi
  state: UploadScreenState
  actions: UploadScreenActions
}

export type UploadScreenImagePickerProps = {
  isPicking: boolean
  isUploading: boolean
  pickImage: () => Promise<void>
  validationResult: UploadValidationResult
}

export type UploadScreenPreviewSectionProps = {
  onRemove: () => void
  preview: UploadPreview | null
}

export type UploadScreenErrorMessageProps = {
  visible: boolean
  error: Error | null
}

export type UploadDestinationNoticeProps = {
  visible: boolean
}

export type UploadSubmissionResult =
  | { status: 'aborted' }
  | { status: 'completed' }
  | { status: 'error'; error: Error }

export type FailedDuplicateChoice = 'tryAgain' | 'uploadAnyway'

export type RunUploadSubmissionParams = {
  isOffline: boolean
  mutateAsync: (params: {
    fileUri: string
    fileType: string
  }) => Promise<unknown>
  onUploadSucceeded: () => void
  preview: UploadPreview | null
  validationResult: UploadValidationResult
  onUploadFailed: (error: unknown) => void
  onDuplicateTryAgain: () => void | Promise<void>
  alert: typeof import('react-native').Alert.alert
  recordFailedUpload: (libraryAssetKey: string) => void
  recordSuccessfulUpload: (libraryAssetKey: string) => void
  getOutcome: (libraryAssetKey: string) => UploadAssetOutcome
}
