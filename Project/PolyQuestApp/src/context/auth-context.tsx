import { fbAuth } from "@/utils/firebase"
import { createContext } from "react"
import { AuthContext as IAuthContext } from "@/types/auth"

export const AuthContext = createContext<IAuthContext>({
  user: fbAuth.currentUser,
  loading: false,
  signIn: async () => {
    return false
  },
  signUp: async () => {
    return false
  },
  signOut: () => {}
})
