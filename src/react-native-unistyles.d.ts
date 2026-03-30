import type { AppTheme } from './shared/theme/themes'

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme
    dark: AppTheme
  }
}
