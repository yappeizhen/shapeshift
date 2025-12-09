import './PauseOverlay.css'

interface PauseOverlayProps {
  onResume: () => void
  onQuit: () => void
}

export function PauseOverlay({ onResume, onQuit }: PauseOverlayProps) {
  return (
    <div className="pause-overlay">
      <div className="pause-content">
        <h2 className="pause-title font-display">PAUSED</h2>

        <div className="pause-buttons">
          <button className="pause-btn resume-btn" onClick={onResume}>
            RESUME
          </button>
          <button className="pause-btn quit-btn" onClick={onQuit}>
            QUIT TO MENU
          </button>
        </div>

        <div className="pause-hint">
          Press <kbd>ESC</kbd> to resume
        </div>
      </div>
    </div>
  )
}

