import { MMKV } from 'react-native-mmkv'

const SUCCESS_KEY = 'upload.successAssetKeys'
const FAILED_KEY = 'upload.failedAssetKeys'

type StringStore = {
  getString: (key: string) => string | undefined
  set: (key: string, value: string) => void
}

const createStore = (): StringStore => {
  try {
    const mmkv = new MMKV()
    return {
      getString: key => mmkv.getString(key),
      set: (key, value) => {
        mmkv.set(key, value)
      }
    }
  } catch {
    if (typeof localStorage !== 'undefined') {
      return {
        getString: key => localStorage.getItem(key) ?? undefined,
        set: (key, value) => {
          localStorage.setItem(key, value)
        }
      }
    }

    const memory = new Map<string, string>()
    return {
      getString: key => memory.get(key),
      set: (key, value) => {
        memory.set(key, value)
      }
    }
  }
}

const storage = createStore()

const readKeys = (key: string): string[] => {
  const raw = storage.getString(key)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

const writeKeys = (key: string, keys: string[]) => {
  storage.set(key, JSON.stringify(keys))
}

export type UploadAssetOutcome = 'none' | 'success' | 'failed'

export const getUploadAssetOutcome = (libraryAssetKey: string): UploadAssetOutcome => {
  if (readKeys(SUCCESS_KEY).includes(libraryAssetKey)) return 'success'
  if (readKeys(FAILED_KEY).includes(libraryAssetKey)) return 'failed'
  return 'none'
}

export const recordSuccessfulUpload = (libraryAssetKey: string) => {
  const success = new Set(readKeys(SUCCESS_KEY))
  const failed = readKeys(FAILED_KEY).filter(k => k !== libraryAssetKey)
  success.add(libraryAssetKey)
  writeKeys(SUCCESS_KEY, [...success])
  writeKeys(FAILED_KEY, failed)
}

export const recordFailedUpload = (libraryAssetKey: string) => {
  const failed = new Set(readKeys(FAILED_KEY))
  failed.add(libraryAssetKey)
  writeKeys(FAILED_KEY, [...failed])
}

export const resetUploadAssetKeyStoreForTests = () => {
  storage.set(SUCCESS_KEY, '')
  storage.set(FAILED_KEY, '')
}
