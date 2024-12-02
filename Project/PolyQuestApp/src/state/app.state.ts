import { Student } from "@/utils/apis/student.api"
import { StateCreator } from "zustand"

interface AppState {
  sidebarOpen: boolean
  studentId: number
  student: Student | null
}

const INIT: AppState = {
  sidebarOpen: true,
  studentId: 0,
  student: null
}

export interface AppStateSlice {
  appState: AppState
  toggleSidebar: () => void
  updateStudentId: (studentId: number) => void
  updateStudent: (student: Student | null) => void
}

export const createAppStateSlice: StateCreator<AppStateSlice> = (set) => ({
  appState: INIT,
  toggleSidebar: () =>
    set((state) => ({
      appState: { ...state.appState, sidebarOpen: !state.appState.sidebarOpen }
    })),
  updateStudentId: (studentId) =>
    set((state) => ({ appState: { ...state.appState, studentId } })),
  updateStudent: (student) =>
    set((state) => ({ appState: { ...state.appState, student } }))
})
