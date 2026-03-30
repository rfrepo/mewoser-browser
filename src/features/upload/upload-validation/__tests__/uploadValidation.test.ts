import { validateUploadSelection } from '../uploadValidation'

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

describe('Upload validation rules', () => {
  describe('file type', () => {
    it.each([['image/jpeg'], ['image/png'], ['image/heic']])(
      'accepts %s',
      mimeType => {
        expect(
          validateUploadSelection({ mimeType, fileSize: 1024 }).isValid
        ).toBe(true)
      }
    )

    it.each([
      ['image/gif'],
      ['image/webp'],
      ['image/bmp'],
      ['application/pdf'],
      ['video/mp4']
    ])('rejects %s', mimeType => {
      const result = validateUploadSelection({ mimeType, fileSize: 1024 })
      expect(result.isValid).toBe(false)
      if (!result.isValid) {
        expect(result.errorCode).toBe('invalid_type')
      }
    })
  })

  describe('file size', () => {
    it('accepts files exactly at 5MB', () => {
      expect(
        validateUploadSelection({
          mimeType: 'image/jpeg',
          fileSize: MAX_FILE_SIZE_BYTES
        }).isValid
      ).toBe(true)
    })

    it('rejects files one byte over 5MB', () => {
      const result = validateUploadSelection({
        mimeType: 'image/jpeg',
        fileSize: MAX_FILE_SIZE_BYTES + 1
      })
      expect(result.isValid).toBe(false)
      if (!result.isValid) {
        expect(result.errorCode).toBe('file_too_large')
      }
    })

    it('accepts small files', () => {
      expect(
        validateUploadSelection({ mimeType: 'image/png', fileSize: 50_000 })
          .isValid
      ).toBe(true)
    })
  })

  describe('combined rules', () => {
    it('returns type error before size when both are invalid', () => {
      const result = validateUploadSelection({
        mimeType: 'image/gif',
        fileSize: MAX_FILE_SIZE_BYTES + 1
      })
      expect(result.isValid).toBe(false)
      if (!result.isValid) {
        expect(result.errorCode).toBe('invalid_type')
      }
    })
  })
})
