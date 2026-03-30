import { StyleSheet } from 'react-native-unistyles'
import { LANDSCAPE_CONTENT_MAX_WIDTH } from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colours.bg
  },
  landscapeContentWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  landscapeContentInner: {
    flex: 1,
    width: '100%',
    ...(rt.isLandscape ? { maxWidth: LANDSCAPE_CONTENT_MAX_WIDTH } : {})
  }
}))
