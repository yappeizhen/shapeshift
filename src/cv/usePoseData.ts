import { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { PoseTrackerContext } from './PoseTrackerContext'
import type { PoseFrame, PoseTrackingStatus } from '@/types'

export function usePoseTracker() {
  const tracker = useContext(PoseTrackerContext)
  if (!tracker) {
    throw new Error('usePoseTracker must be used within a PoseTrackerProvider')
  }
  return tracker
}

export function usePoseData() {
  const tracker = usePoseTracker()
  const [frame, setFrame] = useState<PoseFrame | null>(null)
  const [status, setStatus] = useState<PoseTrackingStatus>(() => tracker.getStatus())

  useEffect(() => {
    const unsubFrame = tracker.subscribe(setFrame)
    const unsubStatus = tracker.onStatusChange(setStatus)
    return () => {
      unsubFrame()
      unsubStatus()
    }
  }, [tracker])

  return { frame, status }
}

export function useVideoRef() {
  const tracker = usePoseTracker()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isStarted, setIsStarted] = useState(false)

  const startTracking = useCallback(async () => {
    if (videoRef.current && !isStarted) {
      await tracker.start(videoRef.current)
      setIsStarted(true)
    }
  }, [tracker, isStarted])

  const stopTracking = useCallback(() => {
    tracker.stop()
    setIsStarted(false)
  }, [tracker])

  return { videoRef, startTracking, stopTracking, isStarted }
}

