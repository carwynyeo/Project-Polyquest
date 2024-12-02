import {
  createStudent,
  deleteStudent,
  getStudents,
  Student
} from "@/utils/apis/student.api"
import { Button, TextInput } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useForm } from "@mantine/form"

export const Route = createFileRoute("/for-testing")({
  component: ForTestingPage
})

function ForTestingPage() {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      id: 1,
      name: "new student",
      email: "new@email.com",
      password: "string",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      oauth_fb: "string",
      oauth_google: "string",
      isEmailPassword: true,
      authMethod: "string",
      authAttempts: 0,
      lastAuthAttemptAt: new Date().toISOString()
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email")
    }
  })

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    form.setFieldValue("id", students.length > 0 ? students.pop()!.id + 1 : 1)
  }, [students])

  const loadStudents = async () => {
    setLoading(true)
    const students = await getStudents()
    setStudents(students)
    setLoading(false)
  }

  const handleNewStudent = async (values: Student) => {
    await createStudent(values)
    await loadStudents()
  }

  const handleDelete = async (id: number) => {
    await deleteStudent(id)
    await loadStudents()
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="mb-2">Create student</h1>

      <form
        onSubmit={form.onSubmit((values) => handleNewStudent(values))}
        className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            withAsterisk
            label="id"
            placeholder="Id"
            key={form.key("id")}
            {...form.getInputProps("id")}
          />

          <TextInput
            withAsterisk
            label="name"
            placeholder="Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <TextInput
            withAsterisk
            label="email"
            placeholder="Email"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <TextInput
            withAsterisk
            label="password"
            placeholder="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <TextInput
            withAsterisk
            disabled
            label="createdAt"
            placeholder="CreatedAt"
            key={form.key("createdAt")}
            {...form.getInputProps("createdAt")}
          />

          <TextInput
            withAsterisk
            disabled
            label="updatedAt"
            placeholder="UpdatedAt"
            key={form.key("updatedAt")}
            {...form.getInputProps("updatedAt")}
          />

          <TextInput
            withAsterisk
            label="oauth_fb"
            placeholder="Oauth_fb"
            key={form.key("oauth_fb")}
            {...form.getInputProps("oauth_fb")}
          />

          <TextInput
            withAsterisk
            label="oauth_google"
            placeholder="Oauth_google"
            key={form.key("oauth_google")}
            {...form.getInputProps("oauth_google")}
          />

          <TextInput
            withAsterisk
            label="isEmailPassword"
            placeholder="IsEmailPassword"
            key={form.key("isEmailPassword")}
            {...form.getInputProps("isEmailPassword")}
          />

          <TextInput
            withAsterisk
            label="authMethod"
            placeholder="AuthMethod"
            key={form.key("authMethod")}
            {...form.getInputProps("authMethod")}
          />

          <TextInput
            withAsterisk
            label="authAttempts"
            placeholder="AuthAttempts"
            key={form.key("authAttempts")}
            {...form.getInputProps("authAttempts")}
          />

          <TextInput
            withAsterisk
            disabled
            label="lastAuthAttemptAt"
            placeholder="LastAuthAttemptAt"
            key={form.key("lastAuthAttemptAt")}
            {...form.getInputProps("lastAuthAttemptAt")}
          />
        </div>

        <Button type="submit">Create Student</Button>
      </form>

      <h1 className="mb-2">These are students</h1>

      <div className="grid grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            className="bg-white rounded p-5 w-full space-y-4"
            key={student.id}>
            <pre>{JSON.stringify(student, null, 1)}</pre>

            <Button color="red" onClick={() => handleDelete(student.id)}>
              Delete student
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
