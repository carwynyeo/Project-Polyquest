import { Button, Input } from "@mantine/core"
import AuthLayout from "@/components/layouts/auth-layout"
import { AuthContext } from "@/context/auth-context"
import { fbAuth } from "@/utils/firebase"
import { createFileRoute, Link } from "@tanstack/react-router"
import { sendPasswordResetEmail } from "firebase/auth"
import { useContext, useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/forget-password")({
  component: ForgetPasswordPage
})

function ForgetPasswordPage() {
  const [email, setEmail] = useState<string>()

  const { loading } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please fill in all fields")
      return
    } else {
      await sendPasswordResetEmail(fbAuth, email)
      toast.info("Please check your email to reset your password")
    }
  }

  return (
    <AuthLayout>
      <div className="flex justify-center min-h-[80vh] items-center">
        <div className="space-y-10 w-full">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold">Forgot Your Password?</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button disabled={loading} type="submit">
              Send me a reset link
            </Button>
          </form>

          <p className="text-center">
            <Link to="/sign-in" className="text-blue-500">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
