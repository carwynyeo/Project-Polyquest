import AuthProvider from "@/components/auth/auth-provider"
import AuthWrapper from "@/components/auth/auth-wrapper"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Toaster } from "sonner"
import "@mantine/core/styles.css"

import { createTheme, MantineProvider } from "@mantine/core"
import ViewportIndicator from "@/components/viewport-indicator"

const theme = createTheme({
  primaryColor: "primary-purple",
  colors: {
    "primary-purple": [
      "#eaeaff",
      "#cfcfff",
      "#9c9cff",
      "#6565ff",
      "#3837fe",
      "#1a19fe",
      "#0609ff",
      "#0000e4",
      "#0000cc",
      "#0000b4"
    ]
  }
})

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <AuthWrapper>
          <Outlet />
          {/* <TanStackRouterDevtools position="bottom-right" /> */}
          <Toaster position="top-center" richColors />
          <ViewportIndicator />
        </AuthWrapper>
      </AuthProvider>
    </MantineProvider>
  )
}
