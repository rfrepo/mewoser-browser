import type { CatImage, VoteDirection } from '@/shared/types/theCatApiDomain'

export const computeVoteState = (
  image: CatImage,
  vote: VoteDirection
): CatImage => {
  const isUp = vote === 'up'
  const isDown = vote === 'down'
  const wasUp = image.userVote === 'up'
  const wasDown = image.userVote === 'down'
  const upVotes = image.upVotes + (isUp ? 1 : 0) - (wasUp ? 1 : 0)
  const downVotes = image.downVotes + (isDown ? 1 : 0) - (wasDown ? 1 : 0)

  return {
    ...image,
    upVotes,
    downVotes,
    userVote: vote,
    score: upVotes - downVotes
  }
}
