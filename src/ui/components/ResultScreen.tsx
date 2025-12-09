import { useEffect, useState, useMemo } from 'react'
import { getMatchQuality } from '@/game'
import './ResultScreen.css'

const CONFETTI_COLORS = ['#ff2d75', '#00f5ff', '#ffd700', '#39ff14']

interface ResultScreenProps {
  success: boolean
  score: number
  matchScore: number
  onContinue: () => void
}

export function ResultScreen({ success, score, matchScore, onContinue }: ResultScreenProps) {
  // Initialize confetti state based on success prop
  const [showConfetti, setShowConfetti] = useState(success)

  // Pre-generate confetti pieces to avoid Math.random in render
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i * 0.01) % 0.5}s`,
        color: CONFETTI_COLORS[i % 4]!,
      })),
    []
  )

  // Hide confetti after animation completes
  useEffect(() => {
    if (!showConfetti) return
    const timer = setTimeout(() => setShowConfetti(false), 2000)
    return () => clearTimeout(timer)
  }, [showConfetti])

  useEffect(() => {
    const timer = setTimeout(onContinue, 2000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div className={`result-screen ${success ? 'success' : 'fail'}`}>
      {/* Confetti for success */}
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                backgroundColor: piece.color,
              }}
            />
          ))}
        </div>
      )}

      <div className="result-content">
        {success ? (
          <>
            <div className="result-icon success-icon">✓</div>
            <h2 className="result-title font-display">{getMatchQuality(matchScore)}</h2>
            <div className="result-score">
              <span className="score-label">+</span>
              <span className="score-value font-display">{score}</span>
            </div>
            <div className="result-match">
              Match: <strong>{matchScore}%</strong>
            </div>
          </>
        ) : (
          <>
            <div className="result-icon fail-icon">✗</div>
            <h2 className="result-title font-display fail-title">MISSED!</h2>
            <div className="result-subtitle">Better luck next time</div>
          </>
        )}

        <div className="result-continue">
          <span className="continue-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

