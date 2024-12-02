import { StateCreator } from "zustand"

interface TestState {
  status: "ongoing" | "completed" | "have-not-taken"
}

const INIT: TestState = {
  status: "have-not-taken"
}

export interface TestStateSlice {
  testState: TestState
  updateTestState: (newState: TestState) => void
}

export const createTestStateSlice: StateCreator<TestStateSlice> = (set) => ({
  testState: INIT,
  updateTestState: (newState) =>
    set((state) => ({
      testState: { ...state.testState, ...newState }
    }))
})
