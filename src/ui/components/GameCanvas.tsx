import { useRef, useEffect } from 'react'
import type { Landmark, PoseShape } from '@/types'
import { KEY_LANDMARKS, POSE_LANDMARKS } from '@/types'
import './GameCanvas.css'

interface GameCanvasProps {
  playerLandmarks: Landmark[] | null
  targetShape: PoseShape | null
  wallProgress: number
  isPlaying: boolean
  matchScore: number
}

// Skeleton connections for drawing
const SKELETON_CONNECTIONS: [number, number][] = [
  // Torso
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
  // Left arm
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  // Right arm
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  // Left leg
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
  // Right leg
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
]

export function GameCanvas({
  playerLandmarks,
  targetShape,
  wallProgress,
  isPlaying,
  matchScore,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Animation loop
    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = Math.min(canvas.width, canvas.height) * 0.8

      // Draw approaching wall with cutout
      if (isPlaying && targetShape) {
        drawWall(ctx, canvas.width, canvas.height, targetShape, wallProgress, scale, centerX, centerY)
      }

      // Draw target pose silhouette (ghost)
      if (targetShape && isPlaying) {
        drawSkeleton(
          ctx,
          targetShape.landmarks,
          scale,
          centerX,
          centerY,
          'rgba(0, 245, 255, 0.3)',
          4
        )
      }

      // Draw player skeleton
      if (playerLandmarks && playerLandmarks.length >= 33) {
        const color = getPlayerColor(matchScore, isPlaying)
        drawSkeleton(ctx, playerLandmarks, scale, centerX, centerY, color, 6)
        drawLandmarkDots(ctx, playerLandmarks, scale, centerX, centerY, color)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(animationId)
    }
  }, [playerLandmarks, targetShape, wallProgress, isPlaying, matchScore])

  return <canvas ref={canvasRef} className="game-canvas" />
}

function drawWall(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shape: PoseShape,
  progress: number,
  scale: number,
  centerX: number,
  centerY: number
) {
  // Wall opacity and scale based on progress
  const wallScale = 0.3 + progress * 0.7
  const wallOpacity = 0.3 + progress * 0.5

  ctx.save()

  // Draw wall background
  ctx.fillStyle = `rgba(255, 45, 117, ${wallOpacity})`
  ctx.fillRect(0, 0, width, height)

  // Create cutout using composite operation
  ctx.globalCompositeOperation = 'destination-out'

  // Draw cutout shape (expanded silhouette)
  const cutoutPadding = 40 * (1 - progress * 0.3) // Shrink padding as wall approaches
  drawExpandedSilhouette(ctx, shape.landmarks, scale * wallScale, centerX, centerY, cutoutPadding)

  ctx.restore()

  // Draw cutout glow
  ctx.save()
  ctx.strokeStyle = `rgba(0, 245, 255, ${0.5 + progress * 0.5})`
  ctx.lineWidth = 3
  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 20 + progress * 30
  drawExpandedSilhouette(ctx, shape.landmarks, scale * wallScale, centerX, centerY, cutoutPadding, true)
  ctx.restore()
}

function drawExpandedSilhouette(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  scale: number,
  centerX: number,
  centerY: number,
  padding: number,
  strokeOnly = false
) {
  // Get bounding points from key landmarks
  const points: { x: number; y: number }[] = []

  for (const idx of KEY_LANDMARKS) {
    const lm = landmarks[idx]
    if (lm) {
      // Mirror X for natural view
      const x = centerX + (0.5 - lm.x) * scale
      const y = centerY + (lm.y - 0.5) * scale
      points.push({ x, y })
    }
  }

  if (points.length < 3) return

  // Create convex hull-ish shape with padding
  ctx.beginPath()

  // Simple approach: draw a rounded shape around all points
  const hull = getConvexHull(points)
  if (hull.length < 3) return

  // Expand points outward from center
  const cx = hull.reduce((sum, p) => sum + p.x, 0) / hull.length
  const cy = hull.reduce((sum, p) => sum + p.y, 0) / hull.length

  const expandedHull = hull.map((p) => {
    const dx = p.x - cx
    const dy = p.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const factor = (dist + padding) / dist
    return { x: cx + dx * factor, y: cy + dy * factor }
  })

  // Draw smooth curve through expanded points
  ctx.moveTo(expandedHull[0]!.x, expandedHull[0]!.y)
  for (let i = 1; i <= expandedHull.length; i++) {
    const p0 = expandedHull[(i - 1) % expandedHull.length]!
    const p1 = expandedHull[i % expandedHull.length]!
    const midX = (p0.x + p1.x) / 2
    const midY = (p0.y + p1.y) / 2
    ctx.quadraticCurveTo(p0.x, p0.y, midX, midY)
  }

  ctx.closePath()

  if (strokeOnly) {
    ctx.stroke()
  } else {
    ctx.fill()
  }
}

function getConvexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length < 3) return points

  // Find centroid
  const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length
  const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length

  // Sort by angle from centroid
  const sorted = [...points].sort((a, b) => {
    const angleA = Math.atan2(a.y - cy, a.x - cx)
    const angleB = Math.atan2(b.y - cy, b.x - cx)
    return angleA - angleB
  })

  return sorted
}

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  scale: number,
  centerX: number,
  centerY: number,
  color: string,
  lineWidth: number
) {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const [startIdx, endIdx] of SKELETON_CONNECTIONS) {
    const start = landmarks[startIdx]
    const end = landmarks[endIdx]

    if (!start || !end) continue
    if ((start.visibility ?? 1) < 0.5 || (end.visibility ?? 1) < 0.5) continue

    // Mirror X coordinate for natural view (like looking in a mirror)
    const startX = centerX + (0.5 - start.x) * scale
    const startY = centerY + (start.y - 0.5) * scale
    const endX = centerX + (0.5 - end.x) * scale
    const endY = centerY + (end.y - 0.5) * scale

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}

function drawLandmarkDots(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  scale: number,
  centerX: number,
  centerY: number,
  color: string
) {
  ctx.fillStyle = color

  for (const idx of KEY_LANDMARKS) {
    const lm = landmarks[idx]
    if (!lm || (lm.visibility ?? 1) < 0.5) continue

    const x = centerX + (0.5 - lm.x) * scale
    const y = centerY + (lm.y - 0.5) * scale

    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
  }
}

function getPlayerColor(matchScore: number, isPlaying: boolean): string {
  if (!isPlaying) return 'rgba(255, 255, 255, 0.8)'

  if (matchScore >= 70) {
    return 'rgba(57, 255, 20, 0.9)' // Success green
  } else if (matchScore >= 50) {
    return 'rgba(255, 215, 0, 0.9)' // Warning yellow
  } else {
    return 'rgba(255, 69, 0, 0.9)' // Fail orange
  }
}

