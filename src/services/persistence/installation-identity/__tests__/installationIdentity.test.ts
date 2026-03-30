import {
  getInstallationIdentity,
  hydrateInstallationIdentity,
  resetInstallationIdentityForTests
} from '../installationIdentity'

describe('installationIdentity', () => {
  beforeEach(async () => {
    await resetInstallationIdentityForTests()
  })

  it('returns the same identity when called repeatedly', async () => {
    await hydrateInstallationIdentity()
    const first = getInstallationIdentity()
    const second = getInstallationIdentity()
    expect(second.installationId).toBe(first.installationId)
    expect(second.createdAt).toBe(first.createdAt)
  })

  it('issues a new identity after reset', async () => {
    await hydrateInstallationIdentity()
    const before = getInstallationIdentity()
    await resetInstallationIdentityForTests()
    await hydrateInstallationIdentity()
    const after = getInstallationIdentity()
    expect(after.installationId).not.toBe(before.installationId)
    expect(after.createdAt).toBeDefined()
  })
})
