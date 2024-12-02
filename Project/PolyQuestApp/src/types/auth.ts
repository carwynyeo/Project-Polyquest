import { User } from "firebase/auth"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthContext {
  user: User | null
  loading: boolean
  signIn: (creds: LoginCredentials) => Promise<boolean>
  signUp: (creds: LoginCredentials) => Promise<boolean>
  signOut: () => void
}
