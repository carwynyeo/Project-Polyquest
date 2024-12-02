import SideMenu from "@/components/side-menu"

interface Props {
  children: React.ReactNode
}

const MainLayout = ({ children }: Props) => (
  <div className="min-h-screen flex w-full">
    <SideMenu />

    <div className="p-5 w-full bg-purple-50">{children}</div>
  </div>
)

export default MainLayout
