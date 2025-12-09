import { create } from 'zustand'
import type { GamePhase, PoseShape, PlayerState } from '@/types'
import {
  getRandomPose,
  getAvailableDifficulties,
  getWallSpeed,
  getTolerance,
  getCheckpointForRound,
  calculateRoundScore,
} from '@/game'

interface GameState {
  // Game phase
  phase: GamePhase
  
  // Current round
  currentRound: number
  currentShape: PoseShape | null
  wallProgress: number // 0-1, how close the wall is
  roundStartTime: number | null
  
  // Match result for current round
  matchScore: number
  lastRoundScore: number
  
  // Player state
  player: PlayerState
  
  // Computed values from difficulty
  wallSpeed: number
  tolerance: number
  
  // Actions
  startGame: () => void
  startRound: () => void
  updateWallProgress: (progress: number) => void
  completeRound: (matchScore: number) => void
  failRound: () => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  setPhase: (phase: GamePhase) => void
}

const INITIAL_LIVES = 3
const MAX_LIVES = 5

const createInitialPlayer = (): PlayerState => ({
  id: 'player1',
  lives: INITIAL_LIVES,
  score: 0,
  currentRound: 0,
  checkpoint: 1,
  highScore: 0,
})

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  phase: 'menu',
  currentRound: 0,
  currentShape: null,
  wallProgress: 0,
  roundStartTime: null,
  matchScore: 0,
  lastRoundScore: 0,
  wallSpeed: 4000,
  tolerance: 0.2,
  player: createInitialPlayer(),

  startGame: () => {
    set({
      phase: 'countdown',
      currentRound: 1,
      wallProgress: 0,
      matchScore: 0,
      lastRoundScore: 0,
      player: createInitialPlayer(),
    })
  },

  startRound: () => {
    const { currentRound } = get()
    const difficulties = getAvailableDifficulties(currentRound)
    const shape = getRandomPose(difficulties)
    const wallSpeed = getWallSpeed(currentRound)
    const tolerance = getTolerance(currentRound)

    set({
      phase: 'playing',
      currentShape: shape,
      wallProgress: 0,
      roundStartTime: performance.now(),
      matchScore: 0,
      wallSpeed,
      tolerance,
    })
  },

  updateWallProgress: (progress: number) => {
    set({ wallProgress: Math.min(1, progress) })
  },

  completeRound: (matchScore: number) => {
    const { currentRound, player, wallSpeed } = get()
    const checkpoint = getCheckpointForRound(currentRound)
    const roundScore = calculateRoundScore(matchScore, wallSpeed, checkpoint.level)
    
    const newScore = player.score + roundScore
    const newHighScore = Math.max(player.highScore, newScore)
    
    // Check for checkpoint bonus (extra life)
    const prevCheckpoint = getCheckpointForRound(currentRound - 1)
    const earnedLife = checkpoint.level > prevCheckpoint.level && player.lives < MAX_LIVES

    set({
      phase: 'success',
      matchScore,
      lastRoundScore: roundScore,
      player: {
        ...player,
        score: newScore,
        highScore: newHighScore,
        currentRound: currentRound,
        checkpoint: checkpoint.level,
        lives: earnedLife ? player.lives + 1 : player.lives,
      },
    })
  },

  failRound: () => {
    const { player } = get()
    const newLives = player.lives - 1

    if (newLives <= 0) {
      set({
        phase: 'gameover',
        matchScore: 0,
        player: {
          ...player,
          lives: 0,
          highScore: Math.max(player.highScore, player.score),
        },
      })
    } else {
      set({
        phase: 'fail',
        matchScore: 0,
        player: {
          ...player,
          lives: newLives,
        },
      })
    }
  },

  resetGame: () => {
    const { player } = get()
    set({
      phase: 'menu',
      currentRound: 0,
      currentShape: null,
      wallProgress: 0,
      roundStartTime: null,
      matchScore: 0,
      lastRoundScore: 0,
      wallSpeed: 4000,
      tolerance: 0.2,
      player: {
        ...createInitialPlayer(),
        highScore: player.highScore,
      },
    })
  },

  pauseGame: () => {
    const { phase } = get()
    if (phase === 'playing') {
      set({ phase: 'paused' })
    }
  },

  resumeGame: () => {
    const { phase } = get()
    if (phase === 'paused') {
      set({ phase: 'playing' })
    }
  },

  setPhase: (phase: GamePhase) => {
    set({ phase })
  },
}))

// Selectors for common derived state
export const selectIsPlaying = (state: GameState) => state.phase === 'playing'
export const selectCanStartRound = (state: GameState) =>
  state.phase === 'countdown' || state.phase === 'success' || state.phase === 'fail'

