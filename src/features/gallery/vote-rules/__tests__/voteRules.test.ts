import { computeVoteState } from '../voteRules'
import type { CatImage, VoteDirection } from '@/shared/types/theCatApiDomain'

const makeImage = (override: Partial<CatImage> = {}): CatImage => ({
  id: 'cat1',
  ownerInstallationId: 'inst',
  imageUrl: 'https://example.com/cat.jpg',
  thumbnailUrl: 'https://example.com/cat.jpg',
  createdAt: new Date().toISOString(),
  isFavourite: false,
  isUserUpload: false,
  upVotes: 0,
  downVotes: 0,
  score: 0,
  ...override
})

describe('Vote rules', () => {
  describe('first vote', () => {
    it('upvote from no prior vote increments upVotes and score', () => {
      const result = computeVoteState(makeImage(), 'up')
      expect(result.upVotes).toBe(1)
      expect(result.downVotes).toBe(0)
      expect(result.score).toBe(1)
      expect(result.userVote).toBe('up')
    })

    it('downvote from no prior vote increments downVotes and decrements score', () => {
      const result = computeVoteState(makeImage(), 'down')
      expect(result.downVotes).toBe(1)
      expect(result.upVotes).toBe(0)
      expect(result.score).toBe(-1)
      expect(result.userVote).toBe('down')
    })
  })

  describe('switching votes', () => {
    it('switching from up to down removes upvote and adds downvote', () => {
      const withUp = makeImage({
        upVotes: 1,
        downVotes: 0,
        score: 1,
        userVote: 'up'
      })
      const result = computeVoteState(withUp, 'down')
      expect(result.upVotes).toBe(0)
      expect(result.downVotes).toBe(1)
      expect(result.score).toBe(-1)
      expect(result.userVote).toBe('down')
    })

    it('switching from down to up removes downvote and adds upvote', () => {
      const withDown = makeImage({
        upVotes: 0,
        downVotes: 1,
        score: -1,
        userVote: 'down'
      })
      const result = computeVoteState(withDown, 'up')
      expect(result.upVotes).toBe(1)
      expect(result.downVotes).toBe(0)
      expect(result.score).toBe(1)
      expect(result.userVote).toBe('up')
    })
  })

  describe('score integrity', () => {
    it('score always equals upVotes minus downVotes', () => {
      const image = makeImage({ upVotes: 5, downVotes: 3, score: 2 })
      const result = computeVoteState(image, 'up')
      expect(result.score).toBe(result.upVotes - result.downVotes)
    })

    it('score does not go below -1 for a single vote chain starting from zero', () => {
      const result = computeVoteState(makeImage(), 'down')
      expect(result.score).toBeGreaterThanOrEqual(-1)
    })
  })

  describe('no neutral state', () => {
    it('voting always sets a direction — userVote is never null after a vote', () => {
      const result = computeVoteState(makeImage(), 'up')
      expect(result.userVote).toBeDefined()
      expect(['up', 'down'] as VoteDirection[]).toContain(result.userVote)
    })
  })
})
