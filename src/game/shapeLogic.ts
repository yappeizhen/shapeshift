export type Vec2 = { x: number; y: number }

export type ShapeConfig =
  | {
      id: string
      name: string
      kind: 'circle'
      center: Vec2
      radius: number
    }
  | {
      id: string
      name: string
      kind: 'rect'
      center: Vec2
      width: number
      height: number
      cornerRadius?: number
    }
  | {
      id: string
      name: string
      kind: 'triangle'
      points: [Vec2, Vec2, Vec2]
    }

export type NormalizedKeypoint = Vec2 & { score?: number; name?: string }

export interface FitOptions {
  minScore?: number
  tolerance?: number
}

export interface FitResult {
  pass: boolean
  insideRatio: number
  insideCount: number
  total: number
}

export function getDefaultShapes(): ShapeConfig[] {
  return [
    {
      id: 'triangle-wide',
      name: 'Triangle',
      kind: 'triangle',
      points: [
        { x: 0.5, y: 0.38 },
        { x: 0.18, y: 0.98 },
        { x: 0.82, y: 0.98 },
      ],
    },
    {
      id: 'door-rect',
      name: 'Tall Rectangle',
      kind: 'rect',
      center: { x: 0.5, y: 0.68 },
      width: 0.46,
      height: 0.6,
      cornerRadius: 0.08,
    },
    {
      id: 'rectangle-thin',
      name: 'Thin Rectangle (Tall)',
      kind: 'rect',
      center: { x: 0.5, y: 0.63 },
      width: 0.26,
      height: 0.7,
      cornerRadius: 0.05,
    },
  ]
}

export function evaluateFit(
  shape: ShapeConfig,
  keypoints: NormalizedKeypoint[],
  opts?: FitOptions,
): FitResult {
  const minScore = opts?.minScore ?? 0.25
  const tolerance = opts?.tolerance ?? 0.04
  const scored = keypoints.filter((k) => (k.score ?? 0) >= minScore)
  if (scored.length === 0) {
    return { pass: false, insideRatio: 0, insideCount: 0, total: 0 }
  }

  const inside = scored.filter((k) => isInsideShape(shape, k, tolerance))
  const insideRatio = inside.length / scored.length
  const pass = scored.length >= 4 && insideRatio >= 0.85

  return {
    pass,
    insideRatio,
    insideCount: inside.length,
    total: scored.length,
  }
}

export function isInsideShape(
  shape: ShapeConfig,
  point: Vec2,
  tolerance: number,
): boolean {
  if (shape.kind === 'circle') {
    const dx = point.x - shape.center.x
    const dy = point.y - shape.center.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist <= Math.max(shape.radius - tolerance, 0)
  }
  if (shape.kind === 'rect') {
    const halfW = shape.width / 2 - tolerance
    const halfH = shape.height / 2 - tolerance
    return (
      Math.abs(point.x - shape.center.x) <= Math.max(halfW, 0) &&
      Math.abs(point.y - shape.center.y) <= Math.max(halfH, 0)
    )
  }
  if (shape.kind === 'triangle') {
    return pointInTriangle(point, shape.points, tolerance)
  }
  return false
}

function pointInTriangle(
  point: Vec2,
  pts: [Vec2, Vec2, Vec2],
  tolerance: number,
) {
  const [a, b, c] = pts
  const area = (p1: Vec2, p2: Vec2, p3: Vec2) =>
    Math.abs(
      (p1.x * (p2.y - p3.y) +
        p2.x * (p3.y - p1.y) +
        p3.x * (p1.y - p2.y)) /
        2,
    )

  const areaABC = area(a, b, c)
  const area1 = area(point, b, c)
  const area2 = area(a, point, c)
  const area3 = area(a, b, point)
  const totalArea = area1 + area2 + area3

  const toleranceArea = areaABC * tolerance + 1e-4
  return Math.abs(areaABC - totalArea) <= toleranceArea
}

