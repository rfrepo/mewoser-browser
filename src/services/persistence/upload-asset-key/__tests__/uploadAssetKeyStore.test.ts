import {
  getUploadAssetOutcome,
  recordFailedUpload,
  recordSuccessfulUpload,
  resetUploadAssetKeyStoreForTests
} from '../uploadAssetKeyStore'

describe('uploadAssetKeyStore', () => {
  beforeEach(() => {
    resetUploadAssetKeyStoreForTests()
  })

  it('returns none when empty', () => {
    expect(getUploadAssetOutcome('id:test')).toBe('none')
  })

  it('records success and clears failed for same key', () => {
    recordFailedUpload('id:a')
    expect(getUploadAssetOutcome('id:a')).toBe('failed')
    recordSuccessfulUpload('id:a')
    expect(getUploadAssetOutcome('id:a')).toBe('success')
  })

  it('records failed', () => {
    recordFailedUpload('id:b')
    expect(getUploadAssetOutcome('id:b')).toBe('failed')
  })
})
