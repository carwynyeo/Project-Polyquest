import { AuthContext } from "@/context/auth-context"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useContext, useEffect, useState } from "react"
import { FiArrowRight } from "react-icons/fi"
import CourseList from "@/components/courses/courseList"
import { useTestState } from "@/hooks/useTestState"
import RecommendedCourses from "@/components/recommendedCourses"
import RecommendedSector from "@/components/recommendedSector"
import { Button, Group } from "@mantine/core"
import CourseSearch from "../components/courseSearch"
import { Course, getCourseById } from "@/utils/courses.api"
import { useStudent } from "@/hooks/useStudent"
import {
  getBookmarksByStudent,
  createBookmark,
  deleteBookmarkByStudent,
  BookmarkCourse
} from "@/utils/bookmark.api"
import { Rcourses } from "@/utils/recommended.api"
export const Route = createFileRoute("/")({
  component: IndexPage
})

function IndexPage() {
  const { user } = useContext(AuthContext)
  //uncomment when real data is in
  //const { testState } = useTestState()
  const { testState, setStatus } = useTestState()
  const { status } = testState // Get test status from Zustand state
  const [searchTerm, setSearchTerm] = useState<string>("") // State for search term
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([])
  const { student, studentId } = useStudent()
  const [recommendedCourses, setRecommendedCourses] = useState<Rcourses[]>([])
  console.log("Student ID: ", studentId)
  console.log("Student: ", student)

  if (!user) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (studentId) {
        try {
          const bookmarks: BookmarkCourse[] =
            await getBookmarksByStudent(studentId)

          // Fetch full course details for each bookmarked course ID
          const courseDetailsPromises = bookmarks.map(async (bookmark) => {
            return await getCourseById(bookmark.course) // Fetch the full Course object by ID
          })

          const coursesWithNulls = await Promise.all(courseDetailsPromises)

          // Filter out any null values in case any course details are missing
          const courses: Course[] = coursesWithNulls.filter(
            (course): course is Course => course !== null
          )

          setBookmarkedCourses(courses) // Set state with full course details
        } catch (error) {
          console.error("Error fetching bookmarks:", error)
        }
      }
    }
    fetchBookmarks()
  }, [studentId])

  // // Load bookmarks from local storage when the component mounts
  // useEffect(() => {
  //   const savedBookmarks = localStorage.getItem("bookmarkedCourses")
  //   if (savedBookmarks) {
  //     const parsedBookmarks = JSON.parse(savedBookmarks)
  //     setBookmarkedCourses(parsedBookmarks)
  //   }
  // }, [])
  //remove when merging
  const handleBookmarkToggle = async (course: Course) => {
    try {
      const isAlreadyBookmarked = bookmarkedCourses.some(
        (item) => item.id === course.id
      )
      if (isAlreadyBookmarked) {
        // Remove bookmark
        await deleteBookmarkByStudent(studentId, course.id)
        setBookmarkedCourses((prev) =>
          prev.filter((item) => item.id !== course.id)
        )
      } else {
        // Add bookmark
        await createBookmark(studentId, course.id) // Ensure `createBookmark` accepts these arguments
        setBookmarkedCourses((prev) => [...prev, course])
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  // const handleTestStart = () => setStatus("ongoing")
  // const handleTestComplete = () => setStatus("completed")
  // const handleResetTest = () => setStatus("have-not-taken")
  // const handleBookmarkToggle = (course: Course) => {
  //   setBookmarkedCourses((prev) => {
  //     const isAlreadyBookmarked = prev.some((item) => item.id === course.id)
  //     let updatedBookmarks
  //     if (isAlreadyBookmarked) {
  //       updatedBookmarks = prev.filter((item) => item.id !== course.id)
  //     } else {
  //       updatedBookmarks = [...prev, course]
  //     }
  //     localStorage.setItem(
  //       "bookmarkedCourses",
  //       JSON.stringify(updatedBookmarks)
  //     ) // Save to local storage
  //     return updatedBookmarks // This will trigger a rerender
  //   })
  // }

  return (
    <div className="p-5 space-y-8">
      <Group mb="md" justify="space-between" align="flex-start">
        <div className="space-y-2">
          <p className="text-gray-800 text-sm">
            Hi {user.displayName ?? user.email},{" "}
          </p>

          <h1 className="text-[#2E3876] text-2xl font-semibold">
            Welcome to PolyQuest!
          </h1>
        </div>
        <div style={{ maxWidth: 300 }}>
          <CourseSearch onSearch={setSearchTerm} />
        </div>
      </Group>

      {/* Buttons for manually changing the state
      <div className="flex space-x-4">
        <Button onClick={handleTestStart}>Start Test (ongoing)</Button>
        <Button onClick={handleTestComplete}>Complete Test</Button>
        <Button onClick={handleResetTest}>Reset Test</Button>
      </div> */}

      {status === "ongoing" && (
        <>
          <div>
            <Link to="/academic-result">
              <div className="bg-[#3F3EFE] rounded-lg text-white relative p-10 h-[200px]">
                <h1 className="text-3xl font-bold mb-4">
                  Find the best course for you
                </h1>
                <p className="text-lg">48 Questions (~5 minutes)</p>

                <span className="flex items-center gap-1 absolute bottom-5 right-5">
                  Let's start <FiArrowRight />
                </span>
              </div>
            </Link>
          </div>
          <div>
            <h1 className="text-[#2E3876] text-base font-semibold">
              Not ready for the quiz? Check out the highest demand courses today
            </h1>
          </div>
          <div className="p-5">
            <CourseList
              searchTerm={searchTerm}
              onBookmarkToggle={handleBookmarkToggle}
              bookmarkedCourses={bookmarkedCourses}
            />
          </div>
        </>
      )}
      {status === "completed" && (
        <div>
          {/* Recommended Courses Display for Completed Test */}
          <h1 className="text-[#2E3876] text-base font-semibold">
            Recommended Courses
          </h1>
          <div className="p-5">
            <RecommendedCourses
              studentID={studentId}
              searchTerm={searchTerm}
              setRecommendedCourses={setRecommendedCourses}
            />
          </div>
          <h1 className="text-[#2E3876] text-base font-semibold">
            Recommended Sectors
          </h1>
          <div className="p-5">
            <RecommendedSector
              studentID={studentId}
              searchTerm={searchTerm}
              recommendedCourses={recommendedCourses}
            />
          </div>
        </div>
      )}

      {status === "have-not-taken" && (
        <>
          <div>
            <Link to="/academic-result">
              <div className="bg-[#3F3EFE] rounded-lg text-white relative p-10 h-[200px]">
                <h1 className="text-3xl font-bold mb-4">
                  Find the best course for you
                </h1>
                <p className="text-lg">48 Questions (~5 minutes)</p>

                <span className="flex items-center gap-1 absolute bottom-5 right-5">
                  Let's start <FiArrowRight />
                </span>
              </div>
            </Link>
          </div>
          <div>
            <h1 className="text-[#2E3876] text-base font-semibold">
              Not ready for the quiz? Check out the highest demand courses today
            </h1>
          </div>
          <div className="p-5">
            <CourseList
              searchTerm={searchTerm}
              onBookmarkToggle={handleBookmarkToggle}
              bookmarkedCourses={bookmarkedCourses}
            />
          </div>
        </>
      )}
    </div>
  )
}
