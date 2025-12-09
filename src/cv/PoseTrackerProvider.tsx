import { useMemo, type ReactNode } from 'react'
import { PoseTrackerContext } from './PoseTrackerContext'
import { createPoseTracker } from './poseTracker'

interface PoseTrackerProviderProps {
  children: ReactNode
  maxPoses?: number
}

export function PoseTrackerProvider({ children, maxPoses = 1 }: PoseTrackerProviderProps) {
  const tracker = useMemo(() => createPoseTracker({ maxPoses }), [maxPoses])

  return <PoseTrackerContext.Provider value={tracker}>{children}</PoseTrackerContext.Provider>
}

