import { AppStateSlice, createAppStateSlice } from "@/state/app.state"
import { createTestStateSlice, TestStateSlice } from "@/state/test.state"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface StoreState extends AppStateSlice, AppStateSlice, TestStateSlice {}

/**
 * Main state in the app
 */
export const useBoundState = create(
  persist<StoreState>(
    (...a) => ({
      ...createAppStateSlice(...a),
      ...createTestStateSlice(...a)
    }),
    { name: "app-store" }
  )
)
