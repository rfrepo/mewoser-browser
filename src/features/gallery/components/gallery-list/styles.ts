import { StyleSheet } from 'react-native-unistyles'
import { galleryHorizontalContentPadding } from '@/shared/layout/contentHorizontalInset'

export const styles = StyleSheet.create((theme, rt) => {
  const horizontal = galleryHorizontalContentPadding(theme, rt)

  return {
    list: {
      flex: 1,
      width: '100%'
    },
    listContent: {
      paddingTop: theme.spacing.md,
      paddingBottom: 96,
      ...horizontal
    }
  }
})
