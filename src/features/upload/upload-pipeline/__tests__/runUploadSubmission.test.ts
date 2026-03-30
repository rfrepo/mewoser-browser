import { runUploadSubmission } from '../runUploadSubmission'

const preview = {
  uri: 'file://out.jpg',
  mimeType: 'image/jpeg',
  fileName: 'cat.jpg',
  fileSizeLabel: '0.1MB',
  libraryAssetKey: 'id:asset-1'
}

describe('runUploadSubmission', () => {
  const mockAlert = jest.fn((title, message, buttons) => {
    const btn = buttons?.[0]
    if (btn?.onPress) btn.onPress()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('aborts when offline', async () => {
    const result = await runUploadSubmission({
      preview,
      validationResult: { isValid: true },
      isOffline: true,
      mutateAsync: jest.fn(),
      alert: mockAlert,
      getOutcome: () => 'none',
      recordSuccessfulUpload: jest.fn(),
      recordFailedUpload: jest.fn(),
      onUploadSucceeded: jest.fn(),
      onUploadFailed: jest.fn(),
      onDuplicateTryAgain: jest.fn()
    })
    expect(result.status).toBe('aborted')
    expect(mockAlert).toHaveBeenCalled()
  })

  it('aborts when validation invalid', async () => {
    const mutateAsync = jest.fn()
    const result = await runUploadSubmission({
      preview,
      validationResult: { isValid: false, errorCode: 'invalid_type' },
      isOffline: false,
      mutateAsync,
      alert: mockAlert,
      getOutcome: () => 'none',
      recordSuccessfulUpload: jest.fn(),
      recordFailedUpload: jest.fn(),
      onUploadSucceeded: jest.fn(),
      onUploadFailed: jest.fn(),
      onDuplicateTryAgain: jest.fn()
    })
    expect(result.status).toBe('aborted')
    expect(mutateAsync).not.toHaveBeenCalled()
  })

  it('completes on success', async () => {
    const mutateAsync = jest.fn().mockResolvedValue({})
    const recordSuccess = jest.fn()
    const onOk = jest.fn()
    const result = await runUploadSubmission({
      preview,
      validationResult: { isValid: true },
      isOffline: false,
      mutateAsync,
      alert: mockAlert,
      getOutcome: () => 'none',
      recordSuccessfulUpload: recordSuccess,
      recordFailedUpload: jest.fn(),
      onUploadSucceeded: onOk,
      onUploadFailed: jest.fn(),
      onDuplicateTryAgain: jest.fn()
    })
    expect(result.status).toBe('completed')
    expect(mutateAsync).toHaveBeenCalledWith({
      fileUri: preview.uri,
      fileType: preview.mimeType
    })
    expect(recordSuccess).toHaveBeenCalledWith('id:asset-1')
    expect(onOk).toHaveBeenCalled()
  })

  it('records failed on mutation error', async () => {
    const err = new Error('network')
    const mutateAsync = jest.fn().mockRejectedValue(err)
    const recordFailed = jest.fn()
    const onFail = jest.fn()
    const result = await runUploadSubmission({
      preview,
      validationResult: { isValid: true },
      isOffline: false,
      mutateAsync,
      alert: mockAlert,
      getOutcome: () => 'none',
      recordSuccessfulUpload: jest.fn(),
      recordFailedUpload: recordFailed,
      onUploadSucceeded: jest.fn(),
      onUploadFailed: onFail,
      onDuplicateTryAgain: jest.fn()
    })
    expect(result.status).toBe('error')
    expect(recordFailed).toHaveBeenCalledWith('id:asset-1')
    expect(onFail).toHaveBeenCalledWith(err)
  })
})
