import { useCallback } from 'react'
import { useRouter } from 'expo-router'

export const useUploadScreenHeader = () => {
  const router = useRouter()

  const onBackPress = useCallback(() => {
    if (router.canGoBack())  router.back()
     else router.replace('/')
  }, [router])

  return { onBackPress }
}
