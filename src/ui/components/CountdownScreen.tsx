import { useEffect, useState } from 'react'
import './CountdownScreen.css'

interface CountdownScreenProps {
  onComplete: () => void
  shapeName: string | null
}

export function CountdownScreen({ onComplete, shapeName }: CountdownScreenProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCount((c) => c - 1)
    }, 800)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <div className="countdown-screen">
      <div className="countdown-content">
        {count > 0 ? (
          <div key={count} className="countdown-number font-display">
            {count}
          </div>
        ) : (
          <div className="countdown-go font-display">GO!</div>
        )}

        {shapeName && (
          <div className="countdown-shape-name">
            Get ready for: <strong>{shapeName}</strong>
          </div>
        )}

        <div className="countdown-hint">Get in position!</div>
      </div>
    </div>
  )
}

