import { fireEvent, render, screen } from '@testing-library/react-native'
import { GalleryStatePanel } from '../GalleryStatePanel'

const baseStatePanel = {
  isEmpty: false,
  hasError: false,
  isLoading: false,
  isOffline: false,
  onRetry: jest.fn(),
  onUpload: jest.fn(),
  lastUpdatedLabel: '',
}

describe('GalleryStatePanel', () => {
  it('renders loading skeleton when isLoading', () => {
    render(
      <GalleryStatePanel
        statePanel={{ ...baseStatePanel, isLoading: true }}
      />
    )
    expect(screen.getByLabelText('Loading gallery card 1')).toBeTruthy()
  })

  it('renders error state with retry button', () => {
    const onRetry = jest.fn()
    render(
      <GalleryStatePanel
        statePanel={{ ...baseStatePanel, hasError: true, onRetry }}
      />
    )
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    fireEvent.press(screen.getByLabelText('Retry loading gallery'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders empty state with upload CTA using design baseline copy', () => {
    const onUpload = jest.fn()
    render(
      <GalleryStatePanel
        statePanel={{ ...baseStatePanel, isEmpty: true, onUpload }}
      />
    )
    expect(screen.getByText('Your Collection is Empty')).toBeTruthy()
    expect(screen.getByText(/Start building your gallery/)).toBeTruthy()
    
    fireEvent.press(screen.getByLabelText('Upload a Cat'))
    
    expect(onUpload).toHaveBeenCalledTimes(1)
    expect(screen.queryByLabelText('Discover Cats')).toBeNull()
  })

  it('renders offline stale label when isOffline and lastUpdatedLabel provided', () => {
    render(
      <GalleryStatePanel
        statePanel={{
          ...baseStatePanel,
          isOffline: true,
          lastUpdatedLabel: 'Offline · Last updated 01/01/2026, 12:00:00'
        }}
      />
    )
    expect(screen.getByText(/Offline · Last updated/)).toBeTruthy()
  })

  it('returns null when no state matches', () => {
    const { toJSON } = render(<GalleryStatePanel statePanel={baseStatePanel} />)
    expect(toJSON()).toBeNull()
  })
})
