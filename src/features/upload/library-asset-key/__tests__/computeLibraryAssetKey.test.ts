import { computeLibraryAssetKey } from '../computeLibraryAssetKey'

describe('computeLibraryAssetKey', () => {
  it('prefers assetId when present', () => {
    expect(
      computeLibraryAssetKey({
        uri: 'file://ignored',
        assetId: 'ABC-123'
      })
    ).toBe('id:ABC-123')
  })

  it('trims assetId', () => {
    expect(
      computeLibraryAssetKey({
        uri: 'file://x',
        assetId: '  id1  '
      })
    ).toBe('id:id1')
  })

  it('falls back to uri when assetId missing', () => {
    expect(
      computeLibraryAssetKey({ uri: 'file://photos/a.jpg' })
    ).toBe('uri:file://photos/a.jpg')
  })

  it('returns unknown when uri empty and no assetId', () => {
    expect(computeLibraryAssetKey({ uri: '   ' })).toBe('unknown')
  })
})
