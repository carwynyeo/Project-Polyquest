import React, { useEffect, useState } from "react"
import {
  getLatestTestId,
  getRecommendationCoursesByRecommendationID,
  getRecommendationIDBytestId,
  Rcourses
} from "@/utils/recommended.api"
import { Card, Button, Container, Flex } from "@mantine/core"
import { FiArrowRight } from "react-icons/fi"
import { CiLaptop } from "react-icons/ci"
import { Course, getCourseById, getCourses } from "@/utils/courses.api"
import CourseViewer from "../components/courses/courseViewer"
import { MdBookmark, MdBookmarkBorder } from "react-icons/md"
import {
  createBookmark,
  deleteBookmarkByStudent,
  getBookmarksByStudent
} from "@/utils/bookmark.api" // Assuming these API functions exist

interface RecommendedCoursesProps {
  studentID: number
  searchTerm: string // Add searchTerm prop
  setRecommendedCourses: React.Dispatch<React.SetStateAction<Rcourses[]>>
}
interface SectorData {
  name: string
  score: number
}

const transformData = (courses: Rcourses[]): SectorData[] => {
  // Count occurrences of each faculty
  const facultyCount: { [key: string]: number } = {}

  courses.forEach((course) => {
    facultyCount[course.facultyName] =
      (facultyCount[course.facultyName] || 0) + 1
  })

  // Transform to SectorData format and sort by score in descending order
  return Object.entries(facultyCount)
    .map(([name, count]) => ({
      name,
      score: (count / courses.length) * 100 // Calculate as a percentage
    }))
    .sort((a, b) => b.score - a.score) // Sort by score in descending order
}

const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  studentID,
  searchTerm,
  setRecommendedCourses
}) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [recommendedCourses, setRecommendedCourse] = useState<Rcourses[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Rcourses | null>(null) // Track selected course
  const [modalOpened, setModalOpened] = useState(false) // Track modal state
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Rcourses[]>([])
  const [isDelayOver, setIsDelayOver] = useState(false)
  // Introduce a delay before rendering and fetching data
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsDelayOver(true) // Set delay as complete
    }, 2000) // Delay time in milliseconds (e.g., 2000 ms for 2 seconds)

    return () => clearTimeout(delayTimer) // Cleanup timeout on component unmount
  }, [])
  const fetchRecommendedCourses = async () => {
    setLoading(true)
    setError(null)
    let testId: null | number = null
    let tries = 1
    const getTestId = async () => {
      if (tries > 5) return
      try {
        console.log("Attempting to fetch latest test ID")

        testId = await getLatestTestId(studentID)
      } catch (error) {
        tries += 1 // Properly increment tries
        console.error("Error fetching test ID, retrying...", error)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await getTestId()
      }
    }
    await getTestId()

    // This should not happen unless the ML fails to insert the correct
    // recommendation rows to the student
    if (testId === null) {
      throw new Error("No test ID found for this student.")
    }

    try {
      // Step 2: Get the recommendation IDs array using the test ID
      let recommendations = await getRecommendationIDBytestId(testId)

      // Check if recommendations is not an array and convert it if necessary
      if (!Array.isArray(recommendations)) {
        recommendations = [recommendations]
      }
      console.log(recommendations)

      const coursesByRecommendation: Rcourses[] = []

      // Step 3: Use Promise.all to get courses for each recommendation ID
      await Promise.all(
        recommendations.map(async (recommendation) => {
          try {
            const courseIDs = await getRecommendationCoursesByRecommendationID(
              recommendation.id
            )

            const courseDetails = (
              await Promise.all(
                courseIDs.map(async (courseData) => {
                  try {
                    const course = await getCourseById(courseData.id)
                    return course // This may return `null` sometimes
                  } catch (error) {
                    console.error("Error fetching course detials:", error)
                    return null
                  }
                })
              )
            ).filter((course): course is Rcourses => course !== null) // Filter out any `null` values

            // Add the filtered courses to the main array
            coursesByRecommendation.push(...courseDetails)
          } catch (error) {
            console.error(
              `Error fetching courses for recommendation ID ${recommendation.id}:`,
              error
            )
          }
        })
      )
      setRecommendedCourse(coursesByRecommendation)
      setRecommendedCourses(coursesByRecommendation)
      console.log("Recommended Courses to Sector:", recommendedCourses)
    } catch (error) {
      setError("Failed to fetch recommended courses.")
      console.error("Error fetching recommendations and courses:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (isDelayOver) {
      fetchRecommendedCourses()

      // Set up the interval for auto-refresh
      const intervalId = setInterval(() => {
        if (recommendedCourses.length === 0) {
          fetchRecommendedCourses()
        } else {
          clearInterval(intervalId) // Stop refreshing once recommendations are fetched
        }
      }, 900)

      // Clear the interval on component unmount
      return () => clearInterval(intervalId)
    }
  }, [studentID, isDelayOver, recommendedCourses.length])

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (studentID) {
        try {
          const bookmarks = await getBookmarksByStudent(studentID)

          const courseDetailsPromises = bookmarks.map(async (bookmark) => {
            return await getCourseById(bookmark.course)
          })

          const coursesWithNulls = await Promise.all(courseDetailsPromises)
          const courses = coursesWithNulls.filter(
            (course): course is Rcourses => course !== null
          )

          setBookmarkedCourses(courses)
        } catch (error) {
          console.error("Error fetching bookmarks:", error)
        }
      }
    }

    fetchBookmarks()
  }, [studentID])

  const handleBookmarkToggle = async (course: Rcourses) => {
    try {
      const isAlreadyBookmarked = bookmarkedCourses.some(
        (item) => item.id === course.id
      )

      if (isAlreadyBookmarked) {
        await deleteBookmarkByStudent(studentID, course.id)
        setBookmarkedCourses((prev) =>
          prev.filter((item) => item.id !== course.id)
        )
      } else {
        await createBookmark(studentID, course.id)
        setBookmarkedCourses((prev) => [...prev, course])
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const openModal = (course: Rcourses) => {
    setSelectedCourse(course)
    setModalOpened(true)
  }
  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(null)

      // Call the API function
      const data = await getCourses()

      // Handle success or error from the API
      if (data) {
        //setCourses(data)
        setCourses(data)
      } else {
        setError("Failed to load courses")
      }
      setLoading(false)
    }

    loadCourses()
  }, [])
  if (loading) return <p>Loading recommended courses...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  // Filter recommended courses based on the search term
  const filteredCourses = searchTerm
    ? courses.filter(
        (course) =>
          course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recommendedCourses

  return (
    <Container
      style={{
        padding: "50px 20px",
        maxWidth: "100%"
      }}>
      <Flex
        mih={50}
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap">
        {filteredCourses.map((courses) => (
          <Card
            key={courses.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              width: 480, // Set the width for the horizontal layout
              height: 130, // Adjust height accordingly
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Distribute content
              position: "relative",
              borderRadius: "25px"
            }}>
            {/* Bookmark Icon */}
            <div
              onClick={() => handleBookmarkToggle(courses)}
              style={{ position: "absolute", top: 25, right: 24 }}>
              {bookmarkedCourses.some((item) => item.id === courses.id) ? (
                <MdBookmark className="text-xl text-blue-500" /> // Filled icon for bookmarked
              ) : (
                <MdBookmarkBorder className="text-xl text-indigo-500" /> // Outline icon for not bookmarked
              )}
            </div>
            {/* Left Section: Icon */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#E0EBFF", // Background color for icon
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  left: 50,
                  top: 35,
                  position: "absolute"
                }}>
                <CiLaptop color="#3F3EFE" size={30} />
              </div>

              {/* Course Name and Institution */}
              <Flex
                direction="column" // Stack items vertically
                justify="flex-start" // Center vertically
                align="flex-start" // Center horizontally
                style={{
                  height: "100%",
                  width: "250px",
                  marginTop: "20px",
                  marginLeft: "50px"
                }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h1 className="text-base font-semibold">
                    {courses.courseName}
                  </h1>
                  <h1 className="text-gray-500 text-xs">
                    {courses.schoolName}
                  </h1>
                </div>
              </Flex>
            </div>

            {/* Right Section: View More Button */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button
                variant="subtle"
                color="dark"
                size="md"
                style={{
                  fontWeight: 600,
                  right: 10,
                  bottom: 6,
                  position: "absolute",
                  background: "transparent"
                }}
                onClick={() => openModal(courses)}>
                View more
                <FiArrowRight style={{ marginLeft: 8 }} /> {/* Right icon */}
              </Button>
            </div>
          </Card>
        ))}
      </Flex>
      {/* Modal for viewing course details */}
      <CourseViewer
        course={selectedCourse}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Container>
  )
}
export default RecommendedCourses
