import { styles } from './styles'
import { AppIcon } from '@/shared/ui/icons/Icons'
import { useUnistyles } from 'react-native-unistyles'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import type { UploadScreenPreviewSectionProps } from '../../types'

export const UploadScreenPreviewSection = ({
  preview,
  onRemove
}: UploadScreenPreviewSectionProps) => {
  const { theme } = useUnistyles()

  if (!preview) {
    return null
  }

  return (
    <View>
      <Text style={styles.previewTitle}>Active Preview</Text>

      <View style={styles.previewCard}>
        <View style={styles.previewImageContainer}>
          <Image
            resizeMode="cover"
            style={styles.previewImage}
            source={{ uri: preview.uri }}
            accessibilityLabel="Selected image preview"
          />

          <View style={styles.previewFlexGrow}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.previewFileName}
            >
              {preview.fileName}
            </Text>

            <Text style={styles.previewMeta}>{preview.fileSizeLabel}</Text>
          </View>
        </View>

        <View style={styles.previewSeparator} />

        <TouchableOpacity
          onPress={onRemove}
          accessibilityRole="button"
          style={styles.removeButton}
          accessibilityLabel="Remove selected image"
        >
          <AppIcon
            size={20}
            icon="trash"
            color={theme.colours.borderStrong}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
