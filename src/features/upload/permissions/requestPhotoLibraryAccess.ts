import type { PermissionOutcome, PhotoLibraryPermissionPort } from './domain'

export const requestPhotoLibraryAccess = async (
  port: PhotoLibraryPermissionPort
): Promise<PermissionOutcome> => {
  const current = await port.get()
  if (current.granted) return 'granted'

  const requested = await port.request()
  if (requested.granted) return 'granted'

  if (!requested.canAskAgain) return 'blocked'

  return 'denied'
}

