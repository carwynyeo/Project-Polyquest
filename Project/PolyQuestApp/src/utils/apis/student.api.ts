import { del, get, patch, post } from "@/utils/api"

export interface Student {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  oauth_fb: string
  oauth_google: string
  isEmailPassword: Boolean
  authMethod: string
  authAttempts: number
  lastAuthAttemptAt: Date
}

export const createStudent = async (student: Student) => {
  const response = await post<Student>({ url: "/student", body: student })
  return response.success ? response.data : null
}

export const getStudent = async (id: number) => {
  const response = await get<Student>({ url: `/student/${id}` })
  return response.success ? response.data : null
}

export const getStudents = async () => {
  const response = await get<Student[]>({ url: "/student" })
  return response.success ? response.data : []
}

export const updateStudent = async (student: Student) => {
  const response = await patch<Student>({
    url: `/student/${student.id}`,
    body: student
  })
  return response.success ? response.data : null
}

export const deleteStudent = async (id: number) => {
  const response = await del({
    url: `/student/${id}`
  })
  return response.success ? response.data : null
}

export const getStudentByEmail = async (email: string) => {
  const response = await get<Student>({
    url: `/student/email?email=${email}`
  })

  if (!response.success) {
    throw Error("Failed to get student by email")
  }

  return response.data
}
