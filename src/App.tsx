import { PoseTrackerProvider } from '@/cv/PoseTrackerProvider'
import { GameContainer } from '@/ui/components/GameContainer'
import './App.css'

function App() {
  return (
    <PoseTrackerProvider>
      <GameContainer />
    </PoseTrackerProvider>
  )
}

export default App

