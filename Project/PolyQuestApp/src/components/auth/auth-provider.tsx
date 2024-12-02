import Spinner from "@/components/spinner"
import { AuthContext } from "@/context/auth-context"
import { fbAuth } from "@/utils/firebase"
import { useNavigate } from "@tanstack/react-router"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User
} from "firebase/auth"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AuthContext as IAuthContext, LoginCredentials } from "@/types/auth"
import { useTestState } from "@/hooks/useTestState"
import { useStudent } from "@/hooks/useStudent"
import { getRecommendationIDByStudent } from "@/utils/apis/testResult.api"
import { getLatestTestId } from "@/utils/recommended.api"

interface Props {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const { setStatus } = useTestState()

  const { studentId } = useStudent()

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!currentUser || !studentId) return

    const checkTestStatus = async () => {
      console.log(`Checking test status for student ${studentId}`)
      let test: number | null = null
      try {
        test = await getLatestTestId(studentId)
      } catch {
        console.log("Student has not taken the test")
        setStatus("have-not-taken")
        return
      }

      if (!test) {
        console.log("Student has not taken the test")
        setStatus("have-not-taken")
      } else {
        const recommendations = await getRecommendationIDByStudent(studentId)

        if (recommendations.length > 0) {
          setStatus("completed")
          console.log("Student has completed the test")
        } else {
          setStatus("ongoing")
          console.log("Student has an ongoing test")
        }
      }
    }

    checkTestStatus()
  }, [currentUser, studentId])

  const signIn = async (creds: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    let success = false

    try {
      const { user } = await signInWithEmailAndPassword(
        fbAuth,
        creds.email,
        creds.password
      )

      setCurrentUser(user)
      success = true
    } catch (error: any) {
      /**
       * Handle error messages here
       */
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
      return success
    }
  }

  const signUp = async (creds: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    let success = false

    try {
      const { user } = await createUserWithEmailAndPassword(
        fbAuth,
        creds.email,
        creds.password
      )
      setCurrentUser(user)
      success = true
    } catch (error: any) {
      /**
       * Handle error messages here
       */
      if (error.message.includes("email-already-in-use")) {
        toast.error("Email already in used")
      } else if (error.message.includes("weak-password")) {
        toast.error("Password is too weak")
      } else {
        toast.error(error.message)
        console.error(error)
      }
    } finally {
      setIsLoading(false)
      return success
    }
  }

  const signOut = async () => {
    //  Navigate first to reduce flicker or data retrieval issues
    navigate({ to: "/sign-in", replace: true })
    await fbAuth.signOut()
  }

  /**
   * Values to be passed to the AuthContext.Provider
   */
  const authValues: IAuthContext = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut
  }

  // TODO: Add a loading spinner
  if (isAuthLoading)
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Spinner />
      </div>
    )

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
