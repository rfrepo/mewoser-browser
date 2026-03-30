import { StyleSheet } from 'react-native-unistyles'
import { darkTheme, lightTheme } from './themes'

StyleSheet.configure({
  themes: {
    dark: darkTheme,
    light: lightTheme
  },
  settings: {
    initialTheme: 'light'
  }
})
