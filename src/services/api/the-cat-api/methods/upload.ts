import type { RemoteUploadPayload, UploadImageParams } from '../types'

const THE_CAT_API_KEY = process.env.EXPO_PUBLIC_THE_CAT_API_KEY ?? ''

const getFileNameFromUri = (uri: string) => {
  const parts = uri.split('/')
  return parts[parts.length - 1] || `upload-${Date.now()}.jpg`
}

const guessMimeType = (uri: string) => {
  const lower = uri.toLowerCase()

  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'

  return 'image/jpeg'
}

export const uploadImage = async ({
  fileUri,
  fileType,
  installationId
}: UploadImageParams): Promise<RemoteUploadPayload> => {
  const formData = new FormData()

  const name = getFileNameFromUri(fileUri)
  const type = fileType || guessMimeType(fileUri)

  formData.append('file', {
    type,
    name,
    uri: fileUri,
  } as any)

  if (installationId) {
    formData.append('sub_id', installationId)
  }

  const response = await fetch('https://api.thecatapi.com/v1/images/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'x-api-key': THE_CAT_API_KEY
    }
  })

  const raw = await response.text()

  if (!response.ok) {
    let detail = raw.trim()
    try {
      const parsed = JSON.parse(raw) as { message?: string }
      if (typeof parsed?.message === 'string') detail = parsed.message
    } catch {
      detail = raw.trim().slice(0, 500)
    }
    throw new Error(`Upload failed (${response.status}): ${detail}`)
  }

  try {
    return JSON.parse(raw) as RemoteUploadPayload
  } catch {
    const snippet = raw.trim().slice(0, 500)
    throw new Error(
      snippet.length > 0 ? snippet : 'Empty or unreadable response from server.'
    )
  }
}
