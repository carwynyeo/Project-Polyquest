import { Button, Input, PasswordInput } from "@mantine/core"
import AuthLayout from "@/components/layouts/auth-layout"
import { AuthContext } from "@/context/auth-context"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useContext, useState } from "react"
import { toast } from "sonner"
import GoogleSignInButton from "@/components/google-sign-in-button"
import {
  createStudent,
  getStudentByEmail,
  Student
} from "@/utils/apis/student.api"
import { useStudent } from "@/hooks/useStudent"

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage
})

function SignUpPage() {
  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()

  const { signUp, loading } = useContext(AuthContext)

  const router = useRouter()
  const { setStudent } = useStudent()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      toast.error("Please fill in all fields")
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match")
    } else {
      const success = await signUp({ email, password })
      if (!success) {
        return
      }
      let student: Student | null = await getStudentByEmail(email)

      const existingStudent = await getStudentByEmail(email)

      if (existingStudent) {
        toast.error("Student with this email already exists")
        return
      }

      try {
        student = await createStudent({
          id: 0,
          email: email,
          password: password,
          name: `${firstName} ${lastName}`,
          isEmailPassword: true,
          authMethod: "email",
          authAttempts: 0,
          lastAuthAttemptAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          oauth_fb: "",
          oauth_google: ""
        })
      } catch {
        toast.error("Failed to create student, please try again later")
        return
      }
      setStudent(student)

      if (success) {
        toast.success("Login Successful")
        router.navigate({ to: "/" })
      } else {
        // A toast message will be shown if there is an error by the AuthProvider
        // DO NOT handle it here
      }
    }
  }

  return (
    <AuthLayout>
      <div className="flex justify-center min-h-[80vh] items-center">
        <div className="space-y-10 w-full">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold">Sign Up</h1>

            <p>Find out your future diploma now!</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <GoogleSignInButton />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="text-sm">
                  First Name
                </label>

                <Input
                  name="firstName"
                  placeholder="First Name"
                  defaultValue={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="lastName" className="text-sm">
                  Last Name
                </label>

                <Input
                  name="lastName"
                  placeholder="Last Name"
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-sm">
                Email
              </label>

              <Input
                name="email"
                type="email"
                placeholder="Email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>

                <PasswordInput
                  name="password"
                  placeholder="Password"
                  defaultValue={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="confirm" className="text-sm">
                  Confirm Password
                </label>

                <PasswordInput
                  name="confirm"
                  placeholder="Password"
                  defaultValue={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button disabled={loading} type="submit">
              Sign Up
            </Button>
          </form>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-500">
              Click here to sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
