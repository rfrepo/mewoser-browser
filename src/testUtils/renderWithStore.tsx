import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { createAppStore } from '@/store/index'
import { ToastProvider } from 'react-native-toastify-expo/lib'

export const createWrapperWithStore = () => {
  const store = createAppStore()
  const Wrapper = ({ children }: PropsWithChildren) => (
    <ToastProvider>
      <Provider store={store}>{children}</Provider>
    </ToastProvider>
  )
  return { store, Wrapper }
}
