import {
  getStudent,
  getStudentByEmail,
  getStudents
} from "@/utils/apis/student.api"
import { expect, test } from "vitest"

test("Get all students", async () => {
  const students = await getStudents()
  expect(students.length).toBeGreaterThan(0)
})

test("Get student by email", async () => {
  const student = await getStudentByEmail("kh0008ng@gmail.com")
  expect(student).toBeDefined()
})

test("Get student by id", async () => {
  const student = await getStudent(49)
  expect(student).toBeDefined()
})
