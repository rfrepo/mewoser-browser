import { styles } from './styles'
import { Header } from './components/header/Header'
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useUploadScreen } from './hooks/use-upload-screen/useUploadScreen'
import { ImagePicker } from './components/image-picker/ImagePicker'
import { UploadScreenPreviewSection } from './components/upload-screen-preview-section/UploadScreenPreviewSection'
import { UploadScreenErrorMessage } from './components/upload-screen-error-message/UploadScreenErrorMessage'
import { UploadDestinationNotice } from './components/upload-destination-notice/UploadDestinationNotice'
import { useEffect } from 'react'

export const UploadScreen = () => {
  const { state, actions, ui } = useUploadScreen()

  const { isSubmitDisabled, submitLabel } = ui

  const { pickImage, clearImage, onUpload, clearPermissionOutcome } = actions

  const {
    preview,
    isPicking,
    validationResult,
    isUploading,
    uploadError
  } = state
  const { permissionOutcome } = state

  useEffect(() => {
    if (!permissionOutcome) return

    if (permissionOutcome === 'denied') {
      Alert.alert(
        'Permission required',
        'Please allow access to your photos to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Another image',
            onPress: () => {
              clearPermissionOutcome()
              void pickImage()
            }
          }
        ]
      )
      clearPermissionOutcome()
      return
    }

    if (permissionOutcome === 'blocked') {
      Alert.alert(
        'Permission needed',
        'We need access to your photos to upload images.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              clearPermissionOutcome()
              void Linking.openSettings()
            }
          }
        ]
      )
      clearPermissionOutcome()
    }
  }, [permissionOutcome, clearPermissionOutcome, pickImage])

  return (
    <View style={styles.screen}>
      <Header />

      <View style={styles.landscapeContentWrap}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.contentContainer, styles.scrollInner]}
        >
        <Text style={styles.subtitle}>
          Choose your favourite feline image to share with the gallery.
        </Text>

        <ImagePicker
          pickImage={pickImage}
          isPicking={isPicking}
          isUploading={isUploading}
          validationResult={validationResult}
        />

        <UploadScreenPreviewSection
          preview={preview}
          onRemove={clearImage}
        />

        <UploadScreenErrorMessage error={uploadError} visible={Boolean(uploadError)} />

        <UploadDestinationNotice visible={isUploading} />

        <TouchableOpacity
          onPress={onUpload}
          accessibilityRole="button"
          disabled={isSubmitDisabled}
          accessibilityLabel="Upload masterpiece"
          style={[
            styles.submitButton,
            isSubmitDisabled ? styles.submitButtonDisabled : undefined
          ]}
        >
          <Text style={styles.submitLabel}>{submitLabel}</Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  )
}
