import { fireEvent, render, screen } from '@testing-library/react-native'
import { GalleryCard } from '../GalleryCard'
import type { CatImage } from '@/shared/types/theCatApiDomain'
import { useGalleryCardActions } from '../hooks/use-gallery-card-actions/useGalleryCardActions'

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons'
}))
jest.mock('../hooks/use-gallery-card-actions/useGalleryCardActions')

const makeImage = (override: Partial<CatImage> = {}): CatImage => ({
  score: 2,
  id: 'cat1',
  upVotes: 3,
  downVotes: 1,
  isFavourite: false,
  isUserUpload: false,
  ownerInstallationId: 'inst-test',
  createdAt: new Date().toISOString(),
  imageUrl: 'https://example.com/cat.jpg',
  thumbnailUrl: 'https://example.com/cat.jpg',
  ...override
})

describe('GalleryCard', () => {
  const mutateVoteAsync = jest.fn()
  const mutateFavouriteAsync = jest.fn()
  const mockedUseGalleryCardActions = useGalleryCardActions as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseGalleryCardActions.mockReturnValue({
      isVotePending: false,
      onVote: mutateVoteAsync,
      isFavouritePending: false,
      onFavouriteToggle: mutateFavouriteAsync
    })
  })

  it('renders the correct score', () => {
    render(<GalleryCard image={makeImage({ score: 5 })} />)
    expect(screen.getByText('5')).toBeTruthy()
  })

  it('calls vote mutation with up when vote up is pressed', () => {
    render(<GalleryCard image={makeImage()} />)
    fireEvent.press(screen.getByLabelText('Vote up'))
    expect(mutateVoteAsync).toHaveBeenCalledWith({
      imageId: 'cat1',
      vote: 'up'
    })
  })

  it('calls vote mutation with down when vote down is pressed', () => {
    render(<GalleryCard image={makeImage()} />)
    fireEvent.press(screen.getByLabelText('Vote down'))
    expect(mutateVoteAsync).toHaveBeenCalledWith({
      imageId: 'cat1',
      vote: 'down'
    })
  })

  it('calls favourite mutation with nextValue true when not yet favourite', () => {
    render(<GalleryCard image={makeImage({ isFavourite: false })} />)
    fireEvent.press(screen.getByLabelText('Add to favourites'))
    expect(mutateFavouriteAsync).toHaveBeenCalledWith({
      imageId: 'cat1',
      nextValue: true
    })
  })

  it('calls favourite mutation with nextValue false when already favourite', () => {
    render(<GalleryCard image={makeImage({ isFavourite: true })} />)
    fireEvent.press(screen.getByLabelText('Remove from favourites'))
    expect(mutateFavouriteAsync).toHaveBeenCalledWith({
      imageId: 'cat1',
      nextValue: false
    })
  })

  it('disables vote controls when vote mutation is pending', () => {
    mockedUseGalleryCardActions.mockReturnValue({
      isVotePending: true,
      onVote: mutateVoteAsync,
      isFavouritePending: false,
      onFavouriteToggle: mutateFavouriteAsync
    })
    render(<GalleryCard image={makeImage()} />)
    const voteUp = screen.getByLabelText('Vote up')
    fireEvent.press(voteUp)
    expect(mutateVoteAsync).not.toHaveBeenCalled()
  })

  it('disables favourite control when favourite mutation is pending', () => {
    mockedUseGalleryCardActions.mockReturnValue({
      isVotePending: false,
      onVote: mutateVoteAsync,
      isFavouritePending: true,
      onFavouriteToggle: mutateFavouriteAsync
    })
    render(<GalleryCard image={makeImage()} />)
    const favBtn = screen.getByLabelText('Add to favourites')
    fireEvent.press(favBtn)
    expect(mutateFavouriteAsync).not.toHaveBeenCalled()
  })
})
