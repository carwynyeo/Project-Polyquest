import { useBoundState } from "@/state/main.state"
import { Student } from "@/utils/apis/student.api"

export const useStudent = () => {
  const { appState, updateStudentId, updateStudent } = useBoundState()
  const { studentId, student } = appState

  const setStudent = (student: Student | null) => {
    if (!student) {
      updateStudent(null)
      updateStudentId(0)
      return
    }
    updateStudent(student)
    updateStudentId(student.id)
  }

  return { studentId, student, setStudent }
}
