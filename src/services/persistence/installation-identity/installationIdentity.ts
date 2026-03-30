import AsyncStorage from '@react-native-async-storage/async-storage'
import { MMKV } from 'react-native-mmkv'

const STORAGE_KEY = 'installation.id'
const CREATION_KEY = 'installation.createdAt'
const LEGACY_SHARED_INSTALLATION_ID = 'inst_meowsers_fixed'

const createInstallationId = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)

  if (typeof globalThis.crypto?.getRandomValues === 'function')
    globalThis.crypto.getRandomValues(bytes)
  else
    bytes.forEach((_, i) => {
      bytes[i] = Math.floor(Math.random() * 256)
    })

  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

let cachedIdentity: { installationId: string; createdAt: string } | null = null
let hydratePromise: Promise<void> | null = null

const writeToMmkv = (installationId: string, createdAt: string): void => {
  try {
    const mmkv = new MMKV()
    mmkv.set(STORAGE_KEY, installationId)
    mmkv.set(CREATION_KEY, createdAt)
  } catch {}
}

const tryReadFromMmkv = (): { installationId: string; createdAt: string } | null => {
  try {
    const mmkv = new MMKV()
    const storedId = mmkv.getString(STORAGE_KEY)
    const storedCreatedAt = mmkv.getString(CREATION_KEY)
    if (!storedId || storedId === LEGACY_SHARED_INSTALLATION_ID) return null
   
    const createdAt = storedCreatedAt ?? new Date().toISOString()
   
    if (!storedCreatedAt) mmkv.set(CREATION_KEY, createdAt)
    return { installationId: storedId, createdAt }
  } catch {
    return null
  }
}

const tryReadFromLocalStorage = (): {
  installationId: string
  createdAt: string
} | null => {
  if (typeof localStorage === 'undefined') return null
  const storedId = localStorage.getItem(STORAGE_KEY)
  const storedCreatedAt = localStorage.getItem(CREATION_KEY)
  
  if (!storedId || storedId === LEGACY_SHARED_INSTALLATION_ID) return null
  
  const createdAt = storedCreatedAt ?? new Date().toISOString()
 
  if (!storedCreatedAt) localStorage.setItem(CREATION_KEY, createdAt)
  return { installationId: storedId, createdAt }
}

const clearMmkvKeys = (): void => {
  try {
    const mmkv = new MMKV()
    mmkv.delete(STORAGE_KEY)
    mmkv.delete(CREATION_KEY)
  } catch {}
}

export const hydrateInstallationIdentity = async (): Promise<void> => {
  if (cachedIdentity) return
  if (hydratePromise) {
    await hydratePromise
    return
  }

  hydratePromise = (async () => {
    const fromMmkv = tryReadFromMmkv()
    if (fromMmkv) {
      cachedIdentity = fromMmkv

      await AsyncStorage.multiSet([
        [STORAGE_KEY, fromMmkv.installationId],
        [CREATION_KEY, fromMmkv.createdAt]
      ])
      return
    }

    const fromLs = tryReadFromLocalStorage()
    if (fromLs) {
      cachedIdentity = fromLs

      await AsyncStorage.multiSet([
        [STORAGE_KEY, fromLs.installationId],
        [CREATION_KEY, fromLs.createdAt]
      ])
      writeToMmkv(fromLs.installationId, fromLs.createdAt)
      return
    }

    let storedId = await AsyncStorage.getItem(STORAGE_KEY)

    let storedCreatedAt = await AsyncStorage.getItem(CREATION_KEY)

    if (storedId && storedId !== LEGACY_SHARED_INSTALLATION_ID) {
      const createdAt = storedCreatedAt ?? new Date().toISOString()

      if (!storedCreatedAt) await AsyncStorage.setItem(CREATION_KEY, createdAt)
      cachedIdentity = { installationId: storedId, createdAt }
      writeToMmkv(storedId, createdAt)
      return
    }

    const installationId = createInstallationId()
    const createdAt = new Date().toISOString()

    await AsyncStorage.multiSet([
      [STORAGE_KEY, installationId],
      [CREATION_KEY, createdAt]
    ])
    cachedIdentity = { installationId, createdAt }
    writeToMmkv(installationId, createdAt)
  })()

  await hydratePromise
}

export const getInstallationIdentity = () => {
  if (cachedIdentity) return cachedIdentity

  const fromMmkv = tryReadFromMmkv()
  if (fromMmkv) {
    cachedIdentity = fromMmkv
    return cachedIdentity
  }

  const fromLs = tryReadFromLocalStorage()
  if (fromLs) {
    cachedIdentity = fromLs
    return cachedIdentity
  }

  throw new Error(
    'Installation identity not ready. Call hydrateInstallationIdentity() before use.'
  )
}

export const resetInstallationIdentityForTests = async (): Promise<void> => {
  cachedIdentity = null
  hydratePromise = null
  
  clearMmkvKeys()
  await AsyncStorage.multiRemove([STORAGE_KEY, CREATION_KEY])

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CREATION_KEY)
  }
}
