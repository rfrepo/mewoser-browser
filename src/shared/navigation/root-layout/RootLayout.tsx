import { Tabs } from 'expo-router'
import { store } from '@/store/index'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { CustomTabBar } from '../custom-tab-bar/CustomTabBar'
import { ToastProvider } from 'react-native-toastify-expo/lib'
import { hydrateInstallationIdentity } from '@/services/persistence/installation-identity/installationIdentity'

export const RootLayout = () => {
  const [identityReady, setIdentityReady] = useState(false)

  useEffect(() => {
    hydrateInstallationIdentity().then(() => setIdentityReady(true))
  }, [])

  if (!identityReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <ToastProvider>
      <Provider store={store}>
        <Tabs
          screenOptions={{
            headerShown: false
          }}
          tabBar={props => <CustomTabBar {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarLabel: 'Home'
            }}
          />

          <Tabs.Screen
            name="upload"
            options={
              ({
                title: 'Upload',
                tabBarLabel: 'Upload',
                unmountOnBlur: true
              } as const) as any
            }
          />
        </Tabs>
      </Provider>
    </ToastProvider>
  )
}
