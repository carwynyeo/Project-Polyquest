import MainLayout from "@/components/layouts/main-layout"
import { AuthContext } from "@/context/auth-context"
import { useRouter } from "@tanstack/react-router"
import { useContext } from "react"

// Pages where auth is not needed
const UNPROTECTED_PAGES = ["/sign-up", "/sign-in"]

interface Props {
  children: React.ReactNode
}

const AuthWrapper = ({ children }: Props) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  if (!user && UNPROTECTED_PAGES.includes(router.state.location.pathname)) {
    return children
  }

  if (!user) {
    router.navigate({ to: "/sign-in" })
  }

  if (user && UNPROTECTED_PAGES.includes(router.state.location.pathname)) {
    router.navigate({ to: "/" })
  }

  return <MainLayout>{children}</MainLayout>
}

export default AuthWrapper
