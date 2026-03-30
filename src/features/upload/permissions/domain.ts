export type PermissionOutcome = 'granted' | 'denied' | 'blocked'

export type PhotoLibraryPermissionState = {
  granted: boolean
  canAskAgain: boolean
}

export type PhotoLibraryPermissionPort = {
  get: () => Promise<PhotoLibraryPermissionState>
  request: () => Promise<PhotoLibraryPermissionState>
}

