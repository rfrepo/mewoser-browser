import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'

type NetworkState = {
  isOffline: boolean
  isConnected: boolean
  isInternetReachable: boolean
}

const DEFAULT_NETWORK_STATE: NetworkState = {
  isOffline: false,
  isConnected: true,
  isInternetReachable: true,
}

export const useNetworkState = () => {
  const [networkState, setNetworkState] = useState<NetworkState>(
    DEFAULT_NETWORK_STATE
  )

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = Boolean(state.isConnected)
      const isInternetReachable = Boolean(
        state.isInternetReachable ?? state.isConnected
      )
      setNetworkState({
        isConnected,
        isInternetReachable,
        isOffline: !(isConnected && isInternetReachable)
      })
    })

    return unsubscribe
  }, [])

  return networkState
}
