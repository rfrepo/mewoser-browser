type LibraryAssetKeyInput = {
  uri: string
  assetId?: string | null
}

export const computeLibraryAssetKey = (asset: LibraryAssetKeyInput): string => {
  const trimmedId = asset.assetId?.trim()
  if (trimmedId) return `id:${trimmedId}`
  const trimmedUri = asset.uri.trim()
  if (!trimmedUri) return 'unknown'
  return `uri:${trimmedUri}`
}
