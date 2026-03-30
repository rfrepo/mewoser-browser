import type { UploadValidationResult } from '../types'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const validateUploadSelection = ({
  fileSize,
  mimeType
}: {
  fileSize: number
  mimeType: string
}): UploadValidationResult => {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      errorCode: 'invalid_type',
      message: 'Supported formats: JPG, PNG, HEIC'
    }
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorCode: 'file_too_large',
      message: 'File must be 5MB or smaller'
    }
  }

  return { isValid: true }
}
