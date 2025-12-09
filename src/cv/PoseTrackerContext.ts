import { createContext } from 'react'
import type { PoseTracker } from './poseTracker'

export const PoseTrackerContext = createContext<PoseTracker | null>(null)

