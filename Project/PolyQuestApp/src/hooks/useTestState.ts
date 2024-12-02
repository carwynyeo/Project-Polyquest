import { useBoundState } from "@/state/main.state"

export const useTestState = () => {
  const { testState, updateTestState } = useBoundState()

  const setStatus = (status: "ongoing" | "completed" | "have-not-taken") => {
    updateTestState({ status })
  }

  return {
    testState,
    setStatus,
    updateTestState
  }
}
