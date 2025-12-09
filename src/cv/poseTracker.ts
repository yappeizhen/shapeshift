import type { PoseFrame, Landmark, PoseTrackingStatus } from '@/types'
import { FilesetResolver, PoseLandmarker, type PoseLandmarkerResult } from '@mediapipe/tasks-vision'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const TASKS_VISION_VERSION = '0.10.22-rc.20250304'
const WASM_FILES_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`

export type PoseFrameListener = (frame: PoseFrame | null) => void
export type StatusListener = (status: PoseTrackingStatus) => void

interface TrackerOptions {
  maxPoses?: number
  cameraConstraints?: MediaTrackConstraints
}

export interface PoseTracker {
  start: (video: HTMLVideoElement) => Promise<void>
  stop: () => void
  subscribe: (listener: PoseFrameListener) => () => void
  onStatusChange: (listener: StatusListener) => () => void
  getStatus: () => PoseTrackingStatus
}

export const createPoseTracker = (options: TrackerOptions = {}): PoseTracker => {
  const maxPoses = options.maxPoses ?? 1
  let landmarker: PoseLandmarker | undefined
  let videoEl: HTMLVideoElement | undefined
  let mediaStream: MediaStream | undefined
  let rafId: number | undefined
  let lastVideoTime = -1
  let status: PoseTrackingStatus = 'idle'
  let lastFrameTimestamp = performance.now()
  const frameListeners = new Set<PoseFrameListener>()
  const statusListeners = new Set<StatusListener>()

  const notifyStatus = (next: PoseTrackingStatus) => {
    if (status === next) return
    status = next
    statusListeners.forEach((listener) => listener(status))
  }

  const emitFrame = (frame: PoseFrame | null) => {
    frameListeners.forEach((listener) => listener(frame))
  }

  const cleanupStream = () => {
    mediaStream?.getTracks().forEach((track) => track.stop())
    mediaStream = undefined
  }

  const stopLoop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = undefined
    }
  }

  const convertResultToFrame = (
    result: PoseLandmarkerResult,
    timestamp: number,
    fps: number
  ): PoseFrame => {
    // Get landmarks from first detected pose (for single player)
    const poseLandmarks = result.landmarks?.[0] ?? []

    const landmarks: Landmark[] = poseLandmarks.map((lm) => ({
      x: lm.x,
      y: lm.y,
      z: lm.z ?? 0,
      visibility: lm.visibility,
    }))

    return {
      landmarks,
      timestamp,
      fps,
    }
  }

  const detectionLoop = () => {
    if (!videoEl || !landmarker) {
      emitFrame(null)
      return
    }

    const hasNewFrame = videoEl.currentTime !== lastVideoTime
    lastVideoTime = videoEl.currentTime

    if (hasNewFrame) {
      const now = performance.now()
      const result = landmarker.detectForVideo(videoEl, now)
      const frameDelta = now - lastFrameTimestamp
      const fps = Number.isFinite(frameDelta) && frameDelta > 0 ? 1000 / frameDelta : 0
      lastFrameTimestamp = now
      emitFrame(convertResultToFrame(result, now, fps))
    }

    rafId = requestAnimationFrame(detectionLoop)
  }

  const ensureLandmarker = async () => {
    if (landmarker) return landmarker
    const filesetResolver = await FilesetResolver.forVisionTasks(WASM_FILES_URL)
    landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
      },
      runningMode: 'VIDEO',
      numPoses: maxPoses,
    })
    return landmarker
  }

  const attachCamera = async (video: HTMLVideoElement) => {
    cleanupStream()
    videoEl = video
    const constraints: MediaStreamConstraints = {
      video: options.cameraConstraints ?? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
        facingMode: 'user',
      },
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    mediaStream = stream
    video.srcObject = stream
    video.playsInline = true
    video.muted = true
    await video.play()
  }

  const start = async (video: HTMLVideoElement) => {
    if (status === 'ready') return
    notifyStatus('initializing')
    try {
      await attachCamera(video)
      await ensureLandmarker()
      notifyStatus('ready')
      lastVideoTime = -1
      stopLoop()
      rafId = requestAnimationFrame(detectionLoop)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        notifyStatus('permission-denied')
      } else {
        console.error('Pose tracker init failed', error)
        notifyStatus('error')
      }
      cleanupStream()
      stopLoop()
      emitFrame(null)
      throw error
    }
  }

  const stop = () => {
    stopLoop()
    cleanupStream()
    landmarker?.close()
    landmarker = undefined
    notifyStatus('idle')
    emitFrame(null)
  }

  return {
    start,
    stop,
    subscribe: (listener) => {
      frameListeners.add(listener)
      return () => frameListeners.delete(listener)
    },
    onStatusChange: (listener) => {
      statusListeners.add(listener)
      return () => statusListeners.delete(listener)
    },
    getStatus: () => status,
  }
}

