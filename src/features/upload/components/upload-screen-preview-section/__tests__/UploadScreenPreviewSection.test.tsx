import { render, screen } from '@testing-library/react-native'
import { UploadScreenPreviewSection } from '../UploadScreenPreviewSection'

describe('UploadScreenPreviewSection', () => {
  it('does not render when preview is null', () => {
    render(
      <UploadScreenPreviewSection
        preview={null}
        onRemove={jest.fn()}
      />
    )

    expect(screen.queryByText('Active Preview')).toBeNull()
  })
})
