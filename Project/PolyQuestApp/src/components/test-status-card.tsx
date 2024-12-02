import { useTestState } from "@/hooks/useTestState"
import { Link, useRouter } from "@tanstack/react-router"

/**
 * Routes to hide the test status card on
 */
const ROUTES_TO_HIDE: { [key: string]: string[] } = {
  "have-not-taken": [],
  ongoing: ["/"],
  completed: []
}

const TestStatusCard = () => {
  const router = useRouter()
  const { testState } = useTestState()
  const { status } = testState

  const currPath = router.state.location.pathname
  // Debugging log to check the test state when the component renders
  console.log("Current test status:", status)
  return (
    <div>
      {status === "ongoing" && !ROUTES_TO_HIDE[status].includes(currPath) ? (
        <div className="border-2 border-[#3F3EFE] text-[#3F3EFE] font-semibold text-sm p-3 text-center rounded-md">
          You're taking the quiz
        </div>
      ) : status === "ongoing" ? (
        <Link to="/test">
          <div className="border-2 border-[#3F3EFE] text-[#3F3EFE] font-semibold text-sm p-3 text-center rounded-md">
            You are in an ongoing quiz, click here to continue
          </div>
        </Link>
      ) : (
        <></>
      )}

      {status === "completed" && !ROUTES_TO_HIDE[status].includes(currPath) && (
        <div></div>
      )}

      {status === "have-not-taken" &&
        !ROUTES_TO_HIDE[status].includes(currPath) && (
          <Link to="/test">
            <div className="bg-[#3F3EFE] p-5 text-white rounded-md space-y-12">
              <p>Hey! Looks like you have not taken a test yet!</p>

              <p className="text-xl font-semibold">Take the test now!</p>
            </div>
          </Link>
        )}
    </div>
  )
}

export default TestStatusCard
