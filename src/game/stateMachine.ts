export type GameState = 'idle' | 'countdown' | 'feedback'

export const COUNTDOWN_SECONDS = 10
export const FEEDBACK_MS = 2000

export function nextShapeIndex(current: number, total: number) {
  if (total <= 0) return 0
  return (current + 1) % total
}

