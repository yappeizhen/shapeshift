import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-converter'
import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'

export class PoseDetectorService {
  private detector: poseDetection.PoseDetector | null = null
  private initPromise: Promise<void> | null = null

  async init() {
    if (this.detector) return
    if (this.initPromise) return this.initPromise

    this.initPromise = (async () => {
      await tf.setBackend('webgl')
      await tf.ready()
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        },
      )
    })()

    return this.initPromise
  }

  async estimate(
    video: HTMLVideoElement,
  ): Promise<poseDetection.Keypoint[] | null> {
    if (!this.detector) return null
    const poses = await this.detector.estimatePoses(video, {
      flipHorizontal: false,
    })
    const pose = poses[0]
    if (!pose) return null
    return pose.keypoints
  }

  async dispose() {
    await this.detector?.dispose()
    this.detector = null
    this.initPromise = null
  }
}

export const poseDetector = new PoseDetectorService()

