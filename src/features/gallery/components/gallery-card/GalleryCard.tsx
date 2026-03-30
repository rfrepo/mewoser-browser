import { AppIcon } from '@/shared/ui/icons/Icons'
import type { GalleryCardProps } from '../../types'
import { useUnistyles } from 'react-native-unistyles'
import { Image, Pressable, Text, View } from 'react-native'
import { galleryCardActionIconSize, styles } from './styles'
import { useGalleryCardActions } from './hooks/use-gallery-card-actions/useGalleryCardActions'

export const GalleryCard = ({ image }: GalleryCardProps) => {
  const { theme } = useUnistyles()
  const { onVote, onFavouriteToggle, isVotePending, isFavouritePending } =
    useGalleryCardActions()

  const isUpSelected = image.userVote === 'up'
  const isDownSelected = image.userVote === 'down'

  const handleFavouriteToggle = () => {
    onFavouriteToggle({ imageId: image.id, nextValue: !image.isFavourite })
  }

  const handleVoteUp = () => {
    onVote({ imageId: image.id, vote: 'up' })
  }

  const handleVoteDown = () => {
    onVote({ imageId: image.id, vote: 'down' })
  }

  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardInner}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: image.imageUrl }}
        />

        <View style={styles.cardFooter}>
          <View style={styles.voteGroup}>
            <Pressable
              onPress={handleVoteUp}
              disabled={isVotePending}
              accessibilityRole="button"
              style={styles.actionButton}
              accessibilityLabel="Vote up"
              accessibilityState={{
                disabled: isVotePending,
                selected: isUpSelected
              }}
            >
              <AppIcon
                icon="voteUp"
                size={galleryCardActionIconSize}
                color={
                  isUpSelected ? theme.colours.success : theme.colours.textSecondary
                }
              />
            </Pressable>

            <Text style={styles.score}>{image.score}</Text>

            <Pressable
              disabled={isVotePending}
              onPress={handleVoteDown}
              accessibilityRole="button"
              style={styles.actionButton}
              accessibilityLabel="Vote down"
              accessibilityState={{
                disabled: isVotePending,
                selected: isDownSelected
              }}
            >
              <AppIcon
                icon="voteDown"
                size={galleryCardActionIconSize}
                color={
                  isDownSelected ? theme.colours.error : theme.colours.textSecondary
                }
              />
            </Pressable>
          </View>

          <Pressable
            style={styles.actionButton}
            disabled={isFavouritePending}
            onPress={handleFavouriteToggle}
            accessibilityLabel={
              image.isFavourite ? 'Remove from favourites' : 'Add to favourites'
            }
            accessibilityRole="button"
            accessibilityState={{
              disabled: isFavouritePending,
              selected: image.isFavourite
            }}
          >
            <AppIcon
              icon={image.isFavourite ? 'favourite' : 'favouriteOutline'}
              size={galleryCardActionIconSize}
              color={
                image.isFavourite
                  ? theme.colours.error
                  : theme.colours.textSecondary
              }
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
