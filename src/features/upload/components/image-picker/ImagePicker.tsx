import { styles } from './styles'
import { AppIcon } from '@/shared/ui/icons/Icons'
import { Text, TouchableOpacity, View } from 'react-native'
import type { UploadScreenImagePickerProps } from '../../types'

export const ImagePicker = ({
  pickImage,
  isPicking,
  isUploading,
  validationResult
}: UploadScreenImagePickerProps) => (
  <View>
    <TouchableOpacity
      onPress={pickImage}
      style={styles.pickerBox}
      accessibilityRole="button"
      accessibilityLabel="Select image"
      disabled={isPicking || isUploading}
    >
      <View style={styles.iconCircle}>
        <AppIcon
          size={24}
          icon="uploadCloud"
          color={styles.icon.color}
        />
      </View>

      <Text style={styles.pickerLabel}>Tap to upload a photo</Text>

      <Text style={styles.infoText}>
        Supported formats: JPG, PNG or HEIC
      </Text>
    </TouchableOpacity>

    {!validationResult.isValid && (
      <Text style={styles.errorText}>{validationResult.message}</Text>
    )}
  </View>
)
