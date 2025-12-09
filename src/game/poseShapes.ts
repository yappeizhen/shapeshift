import type { PoseShape, Landmark, Difficulty } from '@/types'
import { POSE_LANDMARKS } from '@/types'

// Helper to create a landmark with optional visibility
const lm = (x: number, y: number, z = 0, visibility = 1): Landmark => ({ x, y, z, visibility })

// Create a blank 33-landmark array
const createBlankLandmarks = (): Landmark[] => Array(33).fill(null).map(() => lm(0.5, 0.5, 0, 0))

// Helper to set specific landmarks on a base pose
const setPoseLandmarks = (
  base: Landmark[],
  updates: Partial<Record<keyof typeof POSE_LANDMARKS, Landmark>>
): Landmark[] => {
  const result = [...base]
  for (const [key, value] of Object.entries(updates)) {
    const index = POSE_LANDMARKS[key as keyof typeof POSE_LANDMARKS]
    if (index !== undefined && value) {
      result[index] = value
    }
  }
  return result
}

// Pre-defined pose shapes organized by difficulty
export const POSE_SHAPES: PoseShape[] = [
  // === EASY POSES ===
  {
    id: 'tpose',
    name: 'T-Pose',
    difficulty: 'easy',
    description: 'Arms straight out to sides',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.35, 0.3),
      RIGHT_SHOULDER: lm(0.65, 0.3),
      LEFT_ELBOW: lm(0.2, 0.3),
      RIGHT_ELBOW: lm(0.8, 0.3),
      LEFT_WRIST: lm(0.05, 0.3),
      RIGHT_WRIST: lm(0.95, 0.3),
      LEFT_HIP: lm(0.4, 0.55),
      RIGHT_HIP: lm(0.6, 0.55),
      LEFT_KNEE: lm(0.4, 0.75),
      RIGHT_KNEE: lm(0.6, 0.75),
      LEFT_ANKLE: lm(0.4, 0.95),
      RIGHT_ANKLE: lm(0.6, 0.95),
    }),
  },
  {
    id: 'hands-up',
    name: 'Hands Up!',
    difficulty: 'easy',
    description: 'Both arms raised above head',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.2),
      LEFT_SHOULDER: lm(0.4, 0.35),
      RIGHT_SHOULDER: lm(0.6, 0.35),
      LEFT_ELBOW: lm(0.35, 0.2),
      RIGHT_ELBOW: lm(0.65, 0.2),
      LEFT_WRIST: lm(0.35, 0.05),
      RIGHT_WRIST: lm(0.65, 0.05),
      LEFT_HIP: lm(0.43, 0.58),
      RIGHT_HIP: lm(0.57, 0.58),
      LEFT_KNEE: lm(0.43, 0.78),
      RIGHT_KNEE: lm(0.57, 0.78),
      LEFT_ANKLE: lm(0.43, 0.95),
      RIGHT_ANKLE: lm(0.57, 0.95),
    }),
  },
  {
    id: 'wide-stance',
    name: 'Wide Stance',
    difficulty: 'easy',
    description: 'Legs apart, arms at sides',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.4, 0.32),
      RIGHT_SHOULDER: lm(0.6, 0.32),
      LEFT_ELBOW: lm(0.35, 0.45),
      RIGHT_ELBOW: lm(0.65, 0.45),
      LEFT_WRIST: lm(0.32, 0.58),
      RIGHT_WRIST: lm(0.68, 0.58),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.3, 0.75),
      RIGHT_KNEE: lm(0.7, 0.75),
      LEFT_ANKLE: lm(0.25, 0.95),
      RIGHT_ANKLE: lm(0.75, 0.95),
    }),
  },
  {
    id: 'star',
    name: 'Star',
    difficulty: 'easy',
    description: 'Arms and legs spread wide',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.12),
      LEFT_SHOULDER: lm(0.38, 0.28),
      RIGHT_SHOULDER: lm(0.62, 0.28),
      LEFT_ELBOW: lm(0.22, 0.2),
      RIGHT_ELBOW: lm(0.78, 0.2),
      LEFT_WRIST: lm(0.08, 0.1),
      RIGHT_WRIST: lm(0.92, 0.1),
      LEFT_HIP: lm(0.42, 0.52),
      RIGHT_HIP: lm(0.58, 0.52),
      LEFT_KNEE: lm(0.28, 0.72),
      RIGHT_KNEE: lm(0.72, 0.72),
      LEFT_ANKLE: lm(0.18, 0.92),
      RIGHT_ANKLE: lm(0.82, 0.92),
    }),
  },

  // === MEDIUM POSES ===
  {
    id: 'left-point',
    name: 'Point Left',
    difficulty: 'medium',
    description: 'Point to your left with one arm',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.38, 0.3),
      RIGHT_SHOULDER: lm(0.62, 0.3),
      LEFT_ELBOW: lm(0.22, 0.3),
      RIGHT_ELBOW: lm(0.65, 0.42),
      LEFT_WRIST: lm(0.05, 0.3),
      RIGHT_WRIST: lm(0.62, 0.55),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.42, 0.75),
      RIGHT_KNEE: lm(0.58, 0.75),
      LEFT_ANKLE: lm(0.42, 0.95),
      RIGHT_ANKLE: lm(0.58, 0.95),
    }),
  },
  {
    id: 'right-point',
    name: 'Point Right',
    difficulty: 'medium',
    description: 'Point to your right with one arm',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.38, 0.3),
      RIGHT_SHOULDER: lm(0.62, 0.3),
      LEFT_ELBOW: lm(0.35, 0.42),
      RIGHT_ELBOW: lm(0.78, 0.3),
      LEFT_WRIST: lm(0.38, 0.55),
      RIGHT_WRIST: lm(0.95, 0.3),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.42, 0.75),
      RIGHT_KNEE: lm(0.58, 0.75),
      LEFT_ANKLE: lm(0.42, 0.95),
      RIGHT_ANKLE: lm(0.58, 0.95),
    }),
  },
  {
    id: 'warrior',
    name: 'Warrior',
    difficulty: 'medium',
    description: 'Lunge with arms extended',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.18),
      LEFT_SHOULDER: lm(0.38, 0.32),
      RIGHT_SHOULDER: lm(0.62, 0.32),
      LEFT_ELBOW: lm(0.2, 0.32),
      RIGHT_ELBOW: lm(0.8, 0.32),
      LEFT_WRIST: lm(0.05, 0.32),
      RIGHT_WRIST: lm(0.95, 0.32),
      LEFT_HIP: lm(0.4, 0.55),
      RIGHT_HIP: lm(0.6, 0.55),
      LEFT_KNEE: lm(0.25, 0.7),
      RIGHT_KNEE: lm(0.68, 0.72),
      LEFT_ANKLE: lm(0.2, 0.92),
      RIGHT_ANKLE: lm(0.72, 0.92),
    }),
  },
  {
    id: 'disco',
    name: 'Disco',
    difficulty: 'medium',
    description: 'One arm up, one arm down diagonally',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.38, 0.3),
      RIGHT_SHOULDER: lm(0.62, 0.3),
      LEFT_ELBOW: lm(0.28, 0.42),
      RIGHT_ELBOW: lm(0.75, 0.18),
      LEFT_WRIST: lm(0.2, 0.58),
      RIGHT_WRIST: lm(0.88, 0.05),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.42, 0.75),
      RIGHT_KNEE: lm(0.58, 0.75),
      LEFT_ANKLE: lm(0.42, 0.95),
      RIGHT_ANKLE: lm(0.58, 0.95),
    }),
  },
  {
    id: 'airplane',
    name: 'Airplane',
    difficulty: 'medium',
    description: 'Lean to one side with arms out',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.52, 0.18),
      LEFT_SHOULDER: lm(0.38, 0.32),
      RIGHT_SHOULDER: lm(0.62, 0.28),
      LEFT_ELBOW: lm(0.2, 0.38),
      RIGHT_ELBOW: lm(0.82, 0.22),
      LEFT_WRIST: lm(0.05, 0.45),
      RIGHT_WRIST: lm(0.98, 0.15),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.42, 0.75),
      RIGHT_KNEE: lm(0.58, 0.75),
      LEFT_ANKLE: lm(0.42, 0.95),
      RIGHT_ANKLE: lm(0.58, 0.95),
    }),
  },

  // === HARD POSES ===
  {
    id: 'crouch',
    name: 'Crouch',
    difficulty: 'hard',
    description: 'Squat down low',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.35),
      LEFT_SHOULDER: lm(0.38, 0.48),
      RIGHT_SHOULDER: lm(0.62, 0.48),
      LEFT_ELBOW: lm(0.28, 0.52),
      RIGHT_ELBOW: lm(0.72, 0.52),
      LEFT_WRIST: lm(0.35, 0.65),
      RIGHT_WRIST: lm(0.65, 0.65),
      LEFT_HIP: lm(0.4, 0.68),
      RIGHT_HIP: lm(0.6, 0.68),
      LEFT_KNEE: lm(0.32, 0.72),
      RIGHT_KNEE: lm(0.68, 0.72),
      LEFT_ANKLE: lm(0.38, 0.92),
      RIGHT_ANKLE: lm(0.62, 0.92),
    }),
  },
  {
    id: 'tree',
    name: 'Tree Pose',
    difficulty: 'hard',
    description: 'One leg raised, hands together above',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.12),
      LEFT_SHOULDER: lm(0.42, 0.28),
      RIGHT_SHOULDER: lm(0.58, 0.28),
      LEFT_ELBOW: lm(0.42, 0.15),
      RIGHT_ELBOW: lm(0.58, 0.15),
      LEFT_WRIST: lm(0.48, 0.02),
      RIGHT_WRIST: lm(0.52, 0.02),
      LEFT_HIP: lm(0.45, 0.52),
      RIGHT_HIP: lm(0.55, 0.52),
      LEFT_KNEE: lm(0.55, 0.58),
      RIGHT_KNEE: lm(0.55, 0.72),
      LEFT_ANKLE: lm(0.52, 0.68),
      RIGHT_ANKLE: lm(0.55, 0.92),
    }),
  },
  {
    id: 'bow',
    name: 'Bow',
    difficulty: 'hard',
    description: 'Bow forward with arms behind',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.4),
      LEFT_SHOULDER: lm(0.42, 0.45),
      RIGHT_SHOULDER: lm(0.58, 0.45),
      LEFT_ELBOW: lm(0.35, 0.52),
      RIGHT_ELBOW: lm(0.65, 0.52),
      LEFT_WRIST: lm(0.3, 0.45),
      RIGHT_WRIST: lm(0.7, 0.45),
      LEFT_HIP: lm(0.45, 0.58),
      RIGHT_HIP: lm(0.55, 0.58),
      LEFT_KNEE: lm(0.45, 0.75),
      RIGHT_KNEE: lm(0.55, 0.75),
      LEFT_ANKLE: lm(0.45, 0.92),
      RIGHT_ANKLE: lm(0.55, 0.92),
    }),
  },
  {
    id: 'diagonal-reach',
    name: 'Diagonal Reach',
    difficulty: 'hard',
    description: 'Stretch diagonally with opposite arm and leg',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.4, 0.3),
      RIGHT_SHOULDER: lm(0.6, 0.3),
      LEFT_ELBOW: lm(0.28, 0.2),
      RIGHT_ELBOW: lm(0.65, 0.42),
      LEFT_WRIST: lm(0.15, 0.08),
      RIGHT_WRIST: lm(0.65, 0.55),
      LEFT_HIP: lm(0.45, 0.55),
      RIGHT_HIP: lm(0.55, 0.55),
      LEFT_KNEE: lm(0.45, 0.75),
      RIGHT_KNEE: lm(0.7, 0.68),
      LEFT_ANKLE: lm(0.45, 0.92),
      RIGHT_ANKLE: lm(0.85, 0.78),
    }),
  },

  // === EXPERT POSES ===
  {
    id: 'pretzel',
    name: 'Pretzel',
    difficulty: 'expert',
    description: 'Arms crossed with wide stance',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.5, 0.15),
      LEFT_SHOULDER: lm(0.4, 0.32),
      RIGHT_SHOULDER: lm(0.6, 0.32),
      LEFT_ELBOW: lm(0.55, 0.4),
      RIGHT_ELBOW: lm(0.45, 0.4),
      LEFT_WRIST: lm(0.65, 0.32),
      RIGHT_WRIST: lm(0.35, 0.32),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.58, 0.55),
      LEFT_KNEE: lm(0.28, 0.72),
      RIGHT_KNEE: lm(0.72, 0.72),
      LEFT_ANKLE: lm(0.2, 0.92),
      RIGHT_ANKLE: lm(0.8, 0.92),
    }),
  },
  {
    id: 'lightning',
    name: 'Lightning Bolt',
    difficulty: 'expert',
    description: 'Zigzag pose with arms and legs',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.45, 0.15),
      LEFT_SHOULDER: lm(0.38, 0.3),
      RIGHT_SHOULDER: lm(0.55, 0.28),
      LEFT_ELBOW: lm(0.52, 0.22),
      RIGHT_ELBOW: lm(0.72, 0.35),
      LEFT_WRIST: lm(0.65, 0.12),
      RIGHT_WRIST: lm(0.88, 0.42),
      LEFT_HIP: lm(0.42, 0.55),
      RIGHT_HIP: lm(0.55, 0.52),
      LEFT_KNEE: lm(0.55, 0.7),
      RIGHT_KNEE: lm(0.42, 0.72),
      LEFT_ANKLE: lm(0.68, 0.88),
      RIGHT_ANKLE: lm(0.32, 0.92),
    }),
  },
  {
    id: 'windmill',
    name: 'Windmill',
    difficulty: 'expert',
    description: 'Touch opposite foot with arm extended',
    landmarks: setPoseLandmarks(createBlankLandmarks(), {
      NOSE: lm(0.55, 0.35),
      LEFT_SHOULDER: lm(0.48, 0.42),
      RIGHT_SHOULDER: lm(0.62, 0.38),
      LEFT_ELBOW: lm(0.42, 0.55),
      RIGHT_ELBOW: lm(0.78, 0.25),
      LEFT_WRIST: lm(0.35, 0.72),
      RIGHT_WRIST: lm(0.92, 0.12),
      LEFT_HIP: lm(0.5, 0.58),
      RIGHT_HIP: lm(0.6, 0.55),
      LEFT_KNEE: lm(0.42, 0.75),
      RIGHT_KNEE: lm(0.65, 0.72),
      LEFT_ANKLE: lm(0.38, 0.92),
      RIGHT_ANKLE: lm(0.7, 0.92),
    }),
  },
]

// Helper functions
export const getPosesByDifficulty = (difficulty: Difficulty): PoseShape[] => {
  return POSE_SHAPES.filter((pose) => pose.difficulty === difficulty)
}

export const getRandomPose = (difficulties: Difficulty[]): PoseShape => {
  const availablePoses = POSE_SHAPES.filter((pose) => difficulties.includes(pose.difficulty))
  const randomIndex = Math.floor(Math.random() * availablePoses.length)
  return availablePoses[randomIndex] ?? POSE_SHAPES[0]!
}

export const getPoseById = (id: string): PoseShape | undefined => {
  return POSE_SHAPES.find((pose) => pose.id === id)
}

