import './GameOverScreen.css'

interface GameOverScreenProps {
  finalScore: number
  highScore: number
  roundsCompleted: number
  onRestart: () => void
}

export function GameOverScreen({
  finalScore,
  highScore,
  roundsCompleted,
  onRestart,
}: GameOverScreenProps) {
  const isNewHighScore = finalScore >= highScore && finalScore > 0

  return (
    <div className="gameover-screen">
      <div className="gameover-content">
        <h1 className="gameover-title font-display">GAME OVER</h1>

        {isNewHighScore && (
          <div className="new-highscore">
            <span className="highscore-badge">NEW HIGH SCORE!</span>
          </div>
        )}

        <div className="gameover-stats">
          <div className="stat-item">
            <span className="stat-label">Final Score</span>
            <span className="stat-value font-display">{finalScore.toLocaleString()}</span>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <span className="stat-label">Rounds Completed</span>
            <span className="stat-value font-display">{roundsCompleted}</span>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <span className="stat-label">High Score</span>
            <span className="stat-value font-display highscore">
              {Math.max(finalScore, highScore).toLocaleString()}
            </span>
          </div>
        </div>

        <button className="gameover-btn" onClick={onRestart}>
          PLAY AGAIN
        </button>

        <div className="gameover-hint">
          Press <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to restart
        </div>
      </div>

      {/* Decorative elements */}
      <div className="gameover-bg">
        <div className="bg-gradient" />
      </div>
    </div>
  )
}

