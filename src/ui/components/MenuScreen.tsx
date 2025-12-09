import type { PoseTrackingStatus } from '@/types'
import './MenuScreen.css'

interface MenuScreenProps {
  onStart: () => void
  cameraStatus: PoseTrackingStatus
  highScore: number
}

export function MenuScreen({ onStart, cameraStatus, highScore }: MenuScreenProps) {
  const isLoading = cameraStatus === 'initializing'
  const hasError = cameraStatus === 'permission-denied' || cameraStatus === 'error'

  return (
    <div className="menu-screen">
      <div className="menu-content">
        {/* Logo / Title */}
        <div className="menu-logo">
          <h1 className="menu-title font-display">SHAPESHIFT</h1>
          <p className="menu-subtitle">Hole in the Wall</p>
        </div>

        {/* Instructions */}
        <div className="menu-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">📷</span>
            <span>Stand in front of your camera</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">🧍</span>
            <span>Match your body to the shape</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">⚡</span>
            <span>Beat the wall before it reaches you!</span>
          </div>
        </div>

        {/* High Score */}
        {highScore > 0 && (
          <div className="menu-highscore">
            <span className="highscore-label">HIGH SCORE</span>
            <span className="highscore-value font-display">{highScore.toLocaleString()}</span>
          </div>
        )}

        {/* Start Button */}
        <button
          className="menu-start-btn"
          onClick={onStart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Starting Camera...
            </span>
          ) : (
            'START GAME'
          )}
        </button>

        {/* Error message */}
        {hasError && (
          <div className="menu-error">
            {cameraStatus === 'permission-denied' ? (
              <p>Camera access denied. Please allow camera permissions to play.</p>
            ) : (
              <p>Something went wrong. Please refresh and try again.</p>
            )}
          </div>
        )}

        {/* Controls hint */}
        <div className="menu-controls">
          <span>Press <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to start</span>
          <span>Press <kbd>ESC</kbd> to pause</span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="menu-bg-shapes">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
      </div>
    </div>
  )
}

