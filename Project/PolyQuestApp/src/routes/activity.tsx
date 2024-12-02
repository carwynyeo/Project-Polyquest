import { Modal, Button, Group, Text, Title } from "@mantine/core"
import { createFileRoute } from "@tanstack/react-router"
import {
  getRecommendationCoursesByRecommendationID,
  getRecommendationIDByStudent,
  testResult,
  deleteTestResult
} from "@/utils/apis/testResult.api"
import CourseViewer from "../components/courses/courseViewer"
import { Course, getCourseById } from "@/utils/courses.api"
import { useStudent } from "@/hooks/useStudent"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/context/auth-context"
import TestCard from "@/components/pastTest"

export const Route = createFileRoute("/activity")({
  component: Activity
})

function Activity() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null) // Track selected course
  const { user } = useContext(AuthContext)
  const [modalOpened, setModalOpened] = useState(false)
  const { studentId } = useStudent()
  const [testsByTestID, setTestsByTestID] = useState<{
    [testID: number]: testResult[]
  }>({})
  const [coursesByRecommendation, setCoursesByRecommendation] = useState<{
    [recommendationID: number]: Course[]
  }>({})

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [testIdToDelete, setTestIdToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false) // Track delete status

  // Fetch tests and courses
  useEffect(() => {
    const fetchPastTests = async () => {
      if (studentId) {
        try {
          let recommendations = await getRecommendationIDByStudent(studentId)
          // Check if recommendations is not an array and convert it if necessary
          if (!Array.isArray(recommendations)) {
            recommendations = [recommendations]
          }
          console.log(recommendations)
          // Group tests by testID
          const groupedTests: { [testID: number]: testResult[] } = {}
          recommendations.forEach((test) => {
            if (!groupedTests[test.testId]) {
              groupedTests[test.testId] = []
            }
            groupedTests[test.testId].push(test)
          })
          setTestsByTestID(groupedTests)
          console.log(groupedTests)
          const coursesByTest: { [recommendationID: number]: Course[] } = {}

          await Promise.all(
            recommendations.map(async (recommendation) => {
              const courseIDs =
                await getRecommendationCoursesByRecommendationID(
                  recommendation.id
                )
              const courseDetails = await Promise.all(
                courseIDs.map(async (courseData) => {
                  const course = await getCourseById(courseData.id)
                  return course
                })
              )
              coursesByTest[recommendation.id] = courseDetails.filter(
                (course): course is Course => course !== null
              )
            })
          )

          setCoursesByRecommendation(coursesByTest)
          console.log(coursesByTest)
        } catch (error) {
          console.error("Error fetching past tests and courses:", error)
        }
      }
    }

    fetchPastTests()
  }, [studentId])

  const openModal = (course: Course) => {
    setSelectedCourse(course)
    setModalOpened(true)
  }
  const openDeleteModal = (testId: number) => {
    setTestIdToDelete(testId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (testIdToDelete !== null) {
      setIsDeleting(true) // Start delete process
      await deleteTest(testIdToDelete)
      setIsDeleting(false) // End delete process
      setDeleteModalOpen(false)
      setTestIdToDelete(null)
    }
  }
  // Function to delete a test by its ID
  const deleteTest = async (testId: number) => {
    try {
      await deleteTestResult(testId) // Call the delete API
      // Update state to remove the test from testsByTestID
      setTestsByTestID((prevTests) => {
        const updatedTests: { [key: string]: testResult[] } = { ...prevTests } // Explicitly type updatedTests

        // Remove the specific test by its ID
        Object.keys(updatedTests).forEach((key: string) => {
          updatedTests[key] = updatedTests[key].filter(
            (test) => test.testId !== testId
          )
          // If no tests left for this ID, delete the key
          if (updatedTests[key].length === 0) delete updatedTests[key]
        })

        return updatedTests
      })
      console.log(`Test with ID ${testId} deleted successfully.`)
    } catch (error) {
      console.error("Error deleting test:", error)
    }
  }
  return (
    <>
      <div className="p-5 space-y-8">
        <Group mb="md" justify="space-between" align="flex-start">
          <div className="space-y-2">
            <p className="text-gray-800 text-sm">
              Hi {user?.displayName ?? user?.email},{" "}
            </p>

            <h1 className="text-[#2E3876] text-2xl font-semibold">
              Welcome to PolyQuest!
            </h1>
            <h1 className="text-[#000000] text-xl font-semibold">
              Check Out Your Past Tests!
            </h1>
            <div className="p-5">
              <div className="flex flex-wrap gap-4">
                {Object.entries(testsByTestID).map(([testIDStr, tests]) => {
                  const testID = Number(testIDStr) // Convert testID back to a number
                  return (
                    <div key={testID} className="flex gap-4">
                      {tests.map((test) => (
                        <TestCard
                          key={test.testId}
                          recommendationID={test.id}
                          createdAt={new Date(test.createdAt)}
                          onViewMore={openModal}
                          courses={coursesByRecommendation[test.id] || []}
                          onDelete={() => openDeleteModal(test.testId)} // Use openDeleteModal here
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Group>
        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={<h1 style={{ fontWeight: 600 }}>Delete Quiz</h1>}
          size="lg" // Make modal larger
          centered
          styles={{ content: { padding: "24px", borderRadius: "25px" } }} // Apply padding directly
        >
          <h1
            style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
            Are You Sure?
          </h1>
          <h1
            style={{
              fontSize: "14px",
              color: "#6B7280",
              marginBottom: "20px"
            }}>
            We will need 4-5 days to remove your quiz data from our system.
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "16px"
            }}>
            <Button
              color="red"
              onClick={confirmDelete}
              disabled={isDeleting}
              className={`transition-transform duration-300 transform ${
                isDeleting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:scale-105 hover:bg-red-700 text-white"
              }`}>
              {isDeleting ? "Deleting..." : "Delete Quiz"}
            </Button>
          </div>
        </Modal>
        {/* Modal for viewing course details */}
        <CourseViewer
          course={selectedCourse}
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      </div>
    </>
  )
}

export default Activity
