import { ScreenHeader } from '@/shared/components/screen-header/ScreenHeader'
import { useUploadScreenHeader } from '../../hooks/use-upload-screen-header/useUploadScreenHeader'

export const Header = () => {
  const { onBackPress } = useUploadScreenHeader()

  return <ScreenHeader title="Upload Cat Image" onBackPress={onBackPress} />
}
