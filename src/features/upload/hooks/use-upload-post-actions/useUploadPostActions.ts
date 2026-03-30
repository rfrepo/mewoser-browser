import { useCallback, useRef } from 'react'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useToast } from 'react-native-toastify-expo/lib'
import { useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const useUploadPostActions = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const insets = useSafeAreaInsets()
  const isFocusedRef = useRef(false)

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true
      return () => {
        isFocusedRef.current = false
      }
    }, [])
  )

  const onUploadSucceeded = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    
    if (isFocusedRef.current) router.replace('/')
    else
      showToast({
        duration: 3000,
        type: 'success',
        position: 'bottom',
        message: 'Upload successful!',
        containerStyle: { marginTop: insets.top + 8 }
      })
  }, [insets.top, router, showToast])

  const onUploadFailed = useCallback(
    async (error: unknown) => {
      if (isFocusedRef.current) return

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

      const message = (error as Error)?.message ?? 'Upload failed. Please try again.'

      showToast({
        message,
        type: 'error',
        duration: 5000,
        position: 'top',
        containerStyle: { marginTop: insets.top + 8 }
      })
    },
    [insets.top, showToast]
  )

  return {
    onUploadSucceeded,
    onUploadFailed
  }
}
