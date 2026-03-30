import type { ApiFailure } from '@/shared/types/theCatApiDomain'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const toApiFailureFromBaseQueryError = (error: FetchBaseQueryError): ApiFailure => {
  if (error.status === 'FETCH_ERROR')
    return { category: 'network_unavailable', message: 'No network connection. Please retry.' }

  if (error.status === 'PARSING_ERROR')
    return { category: 'request_failed', message: error.error || 'Unexpected request failure.' }

  if (error.status === 'TIMEOUT_ERROR')
    return { category: 'request_failed', message: 'Request timed out.' }

  if (error.status === 'CUSTOM_ERROR')
    return { category: 'request_failed', message: error.error || 'Unexpected request failure.' }

  const data = error.data as { message?: string } | string | undefined
  const statusMessage =
    typeof data === 'string'
      ? data
      : typeof data?.message === 'string'
        ? data.message
        : String(error.status)

  return { category: 'request_failed', message: statusMessage }
}

export const getFileNameFromUri = (uri: string) => {
  const parts = uri.split('/')
  return parts[parts.length - 1] || `upload-${Date.now()}.jpg`
}

export const guessMimeType = (uri: string) => {
  const lower = uri.toLowerCase()
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}
