import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameSettings } from '@/types'

interface SettingsState extends GameSettings {
  setSoundEnabled: (enabled: boolean) => void
  setShowDebugOverlay: (show: boolean) => void
  setCameraId: (cameraId: string | undefined) => void
  toggleSound: () => void
  toggleDebugOverlay: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      showDebugOverlay: false,
      cameraId: undefined,

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setShowDebugOverlay: (show) => set({ showDebugOverlay: show }),
      setCameraId: (cameraId) => set({ cameraId }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleDebugOverlay: () => set((state) => ({ showDebugOverlay: !state.showDebugOverlay })),
    }),
    {
      name: 'shapeshift-settings',
    }
  )
)

