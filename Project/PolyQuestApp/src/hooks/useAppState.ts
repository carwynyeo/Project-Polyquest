import { useBoundState } from "@/state/main.state"

export const useAppState = () => {
  const { appState, toggleSidebar } = useBoundState()

  return {
    toggleSidebar,
    ...appState
  }
}
