import { resolveUploadDuplicateGate } from '../resolveUploadDuplicateGate'

describe('resolveUploadDuplicateGate', () => {
  const pressButton = (index: number) =>
    jest.fn((title, message, buttons) => {
      const btn = buttons?.[index]
      if (btn?.onPress) btn.onPress()
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns proceed when prior is none without alerting', async () => {
    const alert = jest.fn()
    const result = await resolveUploadDuplicateGate({
      prior: 'none',
      alert,
      onDuplicateTryAgain: jest.fn()
    })
    expect(result).toBe('proceed')
    expect(alert).not.toHaveBeenCalled()
  })

  it('returns aborted when prior success and user cancels', async () => {
    const alert = pressButton(0)
    const result = await resolveUploadDuplicateGate({
      prior: 'success',
      alert,
      onDuplicateTryAgain: jest.fn()
    })
    expect(result).toBe('aborted')
  })

  it('returns proceed when prior success and user uploads anyway', async () => {
    const alert = pressButton(1)
    const result = await resolveUploadDuplicateGate({
      prior: 'success',
      alert,
      onDuplicateTryAgain: jest.fn()
    })
    expect(result).toBe('proceed')
  })

  it('returns aborted when prior failed and user tries another image', async () => {
    const onDuplicateTryAgain = jest.fn().mockResolvedValue(undefined)
    const alert = pressButton(0)
    const result = await resolveUploadDuplicateGate({
      prior: 'failed',
      alert,
      onDuplicateTryAgain
    })
    expect(result).toBe('aborted')
    expect(onDuplicateTryAgain).toHaveBeenCalled()
  })

  it('returns proceed when prior failed and user uploads anyway', async () => {
    const alert = pressButton(1)
    const result = await resolveUploadDuplicateGate({
      prior: 'failed',
      alert,
      onDuplicateTryAgain: jest.fn()
    })
    expect(result).toBe('proceed')
  })
})
