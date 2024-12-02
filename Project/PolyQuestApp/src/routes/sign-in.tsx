import GoogleSignInButton from "@/components/google-sign-in-button"
import AuthLayout from "@/components/layouts/auth-layout"
import { AuthContext } from "@/context/auth-context"
import { useStudent } from "@/hooks/useStudent"
import { getStudentByEmail } from "@/utils/apis/student.api"
import { Button, Input, PasswordInput } from "@mantine/core"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { useContext, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/sign-in")({
  component: SignInPage
})

function SignInPage() {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const { signIn, loading } = useContext(AuthContext)

  const router = useRouter()
  const { setStudent } = useStudent()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    } else {
      const res = await signIn({ email, password })
      const student = await getStudentByEmail(email)
      if (res) {
        setStudent(student)
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
            <h1 className="text-4xl font-semibold">Sign In</h1>

            <p>Find out your future diploma now!</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <GoogleSignInButton />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm">
                Email
              </label>

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm">
                  Password
                </label>

                <span className="underline text-sm">
                  <Link to="/forget-password">Forget Password?</Link>
                </span>
              </div>

              <PasswordInput
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button disabled={loading} type="submit">
              Login
            </Button>
          </form>

          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="text-blue-500">
              Click here to sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
