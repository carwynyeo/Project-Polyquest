import { AuthContext } from "@/context/auth-context"
import { useContext } from "react"
import { Avatar, NavLink } from "@mantine/core"
import { AiOutlineQuestionCircle } from "react-icons/ai"
import { FiLogOut } from "react-icons/fi"
import { MdDashboard } from "react-icons/md"
import { CiBookmark } from "react-icons/ci"
import { IoMdTrendingUp } from "react-icons/io"
import { IoSettingsOutline } from "react-icons/io5"
import TestStatusCard from "@/components/test-status-card"
import { useRouter, useRouterState } from "@tanstack/react-router"
import { useStudent } from "@/hooks/useStudent"
import { useTestState } from "@/hooks/useTestState"

const SideMenu = () => {
  const { signOut, user } = useContext(AuthContext)
  const { setStudent } = useStudent()

  const router = useRouter()
  const routerState = useRouterState()

  const { testState } = useTestState()
  const { status } = testState
  const takeTestStyle: React.CSSProperties = {
    border: "1px solid #4318FF", // Border thickness
    borderRadius: "10px",
    padding: "10px",
    color: "#4318FF", // Text color set to blue
    textAlign: "center" as "center", // Specify as "center"
    margin: "5px 0",
    display: "block" // Ensure it's treated as a block element for proper spacing
  }
  const navItems = [
    { label: "Dashboard", to: "/", icon: <MdDashboard /> },
    { label: "Bookmarks", to: "/bookmark", icon: <CiBookmark /> },
    { label: "Activity", to: "/activity", icon: <IoMdTrendingUp /> },
    { label: "Settings", to: "/settings", icon: <IoSettingsOutline /> },
    ...(status === "completed"
      ? [
          {
            label: "New Test",
            to: "/test",

            customStyle: "take-test-link"
          }
        ]
      : [])
  ]

  if (!user) {
    return <></>
  }

  const isActive = (path: string) => routerState.location.pathname === path

  return (
    <div className="flex flex-col justify-between h-screen max-w-[300px] w-full p-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2 h-16">
          {user.photoURL ? (
            <Avatar src={user.photoURL} />
          ) : (
            <Avatar color="cyan">{user.email?.charAt(0).toUpperCase()}</Avatar>
          )}

          <span className="capitalize">
            {user.displayName ?? user.email?.split("@")[0].toLowerCase()}
          </span>
        </div>

        <hr />

        <TestStatusCard />

        <div>
          {navItems.map((item) => {
            const { label, to, icon } = item

            return (
              <NavLink
                key={to}
                label={
                  label === "New Test" ? (
                    <span style={takeTestStyle}>{label}</span>
                  ) : (
                    label // Default label for other items
                  )
                }
                active={isActive(to)}
                variant="filled"
                className="rounded"
                leftSection={icon}
                onClick={() => router.navigate({ to })}
              />
            )
          })}
        </div>
      </div>

      <div>
        <NavLink
          label="Contact Us"
          leftSection={<AiOutlineQuestionCircle />}
          onClick={() => router.navigate({ to: "/contact" })}
        />

        <NavLink
          label="Log Out"
          leftSection={<FiLogOut />}
          onClick={() => {
            setStudent(null)
            signOut()
          }}
        />
      </div>
    </div>
  )
}

export default SideMenu
