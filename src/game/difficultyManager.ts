import type { Checkpoint, Difficulty } from '@/types'

export const CHECKPOINTS: Checkpoint[] = [
  {
    level: 1,
    name: 'Warm Up',
    roundsRequired: 5,
    wallSpeed: 4000, // 4 seconds
    tolerance: 0.2, // Very forgiving
    availablePoses: ['easy'],
  },
  {
    level: 2,
    name: 'Getting Started',
    roundsRequired: 10,
    wallSpeed: 3500,
    tolerance: 0.18,
    availablePoses: ['easy', 'medium'],
  },
  {
    level: 3,
    name: 'Challenge Mode',
    roundsRequired: 15,
    wallSpeed: 3000,
    tolerance: 0.15,
    availablePoses: ['medium'],
  },
  {
    level: 4,
    name: 'Expert Zone',
    roundsRequired: 20,
    wallSpeed: 2500,
    tolerance: 0.12,
    availablePoses: ['medium', 'hard'],
  },
  {
    level: 5,
    name: 'Master Level',
    roundsRequired: 25,
    wallSpeed: 2200,
    tolerance: 0.1,
    availablePoses: ['hard'],
  },
  {
    level: 6,
    name: 'Shapeshifter',
    roundsRequired: Infinity, // Endless
    wallSpeed: 2000,
    tolerance: 0.08,
    availablePoses: ['hard', 'expert'],
  },
]

export const getCheckpointForRound = (round: number): Checkpoint => {
  // Find the highest checkpoint the player has reached
  let checkpoint = CHECKPOINTS[0]!

  for (const cp of CHECKPOINTS) {
    if (round >= cp.roundsRequired) {
      continue
    }
    checkpoint = cp
    break
  }

  // If past all checkpoints, return the last one
  if (round >= CHECKPOINTS[CHECKPOINTS.length - 1]!.roundsRequired) {
    checkpoint = CHECKPOINTS[CHECKPOINTS.length - 1]!
  }

  return checkpoint
}

export const getCheckpointLevel = (round: number): number => {
  for (let i = CHECKPOINTS.length - 1; i >= 0; i--) {
    const cp = CHECKPOINTS[i]!
    if (round >= cp.roundsRequired - (CHECKPOINTS[i - 1]?.roundsRequired ?? 0)) {
      if (i === CHECKPOINTS.length - 1) return cp.level
    }
  }

  // Calculate which checkpoint level based on cumulative rounds
  let cumulativeRounds = 0
  for (const cp of CHECKPOINTS) {
    cumulativeRounds = cp.roundsRequired
    if (round < cumulativeRounds) {
      return cp.level
    }
  }

  return CHECKPOINTS[CHECKPOINTS.length - 1]!.level
}

export const isNewCheckpoint = (previousRound: number, currentRound: number): boolean => {
  const prevCheckpoint = getCheckpointForRound(previousRound)
  const currCheckpoint = getCheckpointForRound(currentRound)
  return currCheckpoint.level > prevCheckpoint.level
}

export const getAvailableDifficulties = (round: number): Difficulty[] => {
  const checkpoint = getCheckpointForRound(round)
  return checkpoint.availablePoses
}

export const getWallSpeed = (round: number): number => {
  const checkpoint = getCheckpointForRound(round)
  return checkpoint.wallSpeed
}

export const getTolerance = (round: number): number => {
  const checkpoint = getCheckpointForRound(round)
  return checkpoint.tolerance
}

export const calculateRoundScore = (
  matchScore: number,
  wallSpeed: number,
  checkpoint: number
): number => {
  // Base score from match quality
  const baseScore = matchScore

  // Speed bonus (faster walls = more points)
  const speedMultiplier = 5000 / wallSpeed

  // Checkpoint multiplier
  const checkpointMultiplier = 1 + (checkpoint - 1) * 0.2

  return Math.round(baseScore * speedMultiplier * checkpointMultiplier)
}

