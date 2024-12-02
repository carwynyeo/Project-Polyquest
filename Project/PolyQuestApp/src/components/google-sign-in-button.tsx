import { useStudent } from "@/hooks/useStudent"
import { createStudent, getStudentByEmail } from "@/utils/apis/student.api"
import { gAuthProvider } from "@/utils/firebase"
import { Button } from "@mantine/core"
import { useRouter } from "@tanstack/react-router"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

const GoogleSignInButton = () => {
  const auth = getAuth()
  const router = useRouter()
  const { setStudent } = useStudent()

  const handleSignIn = async () => {
    signInWithPopup(auth, gAuthProvider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)

        if (!credential) {
          throw new Error("No credential")
        }

        const isExistingUser = await getStudentByEmail(result.user.email ?? "")

        if (!isExistingUser) {
          try {
            const student = await createStudent({
              id: 0,
              name: result.user.displayName ?? "",
              email: result.user.email ?? "",
              password: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              oauth_fb: "",
              oauth_google: result.user.uid,
              isEmailPassword: false,
              authMethod: "google",
              authAttempts: 0,
              lastAuthAttemptAt: new Date()
            })

            setStudent(student)
          } catch (error) {
            console.error(error)
          }
        } else {
          setStudent(isExistingUser)
        }

        toast.success("Login Successful")
        router.navigate({ to: "/" })
      })
      .catch((error) => {
        const errorMessage = error.message
        toast.error(errorMessage)
      })
  }

  return (
    <Button onClick={handleSignIn} variant="default" leftSection={<FcGoogle />}>
      Log in with Google
    </Button>
  )
}

export default GoogleSignInButton
