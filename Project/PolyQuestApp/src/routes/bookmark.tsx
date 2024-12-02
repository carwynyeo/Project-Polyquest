import { createFileRoute } from "@tanstack/react-router"
import React, { useEffect, useState } from "react"
import { Container, Flex, Title } from "@mantine/core"
import CourseElement from "../components/courses/courseElement"
import CourseViewer from "../components/courses/courseViewer"
import { Course, getCourseById } from "@/utils/courses.api"
import {
  getBookmarksByStudent,
  createBookmark,
  deleteBookmarkByStudent,
  BookmarkCourse
} from "@/utils/bookmark.api"
import { useStudent } from "@/hooks/useStudent"

export const Route = createFileRoute("/bookmark")({
  component: Bookmark
})
// Access the studentId from useStudent

function Bookmark() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const { studentId } = useStudent()
  const [bookmarksChanged, setBookmarksChanged] = useState(false) // New state to track changesb

  const fetchBookmarks = async () => {
    if (studentId) {
      try {
        let bookmarks = await getBookmarksByStudent(studentId)
        console.log("Fetched bookmarks:", bookmarks)

        // Ensure bookmarks is an array
        if (!Array.isArray(bookmarks)) {
          bookmarks = [bookmarks]
        }

        // Extract course IDs using the correct field name
        const courseIds = bookmarks.map((bookmark) => {
          console.log("Extracting course ID from bookmark:", bookmark.course)
          return bookmark.course // Replace `courseId` with the actual field name found in the logs
        })
        console.log("Course IDs to fetch:", courseIds)

        const courseDetailsPromises = courseIds.map((courseId) =>
          getCourseById(courseId)
        )
        const coursesWithNulls = await Promise.all(courseDetailsPromises)

        const courses = coursesWithNulls.filter(
          (course): course is Course => course !== null
        )
        setBookmarkedCourses(courses)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      }
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [bookmarksChanged, studentId])

  const openModal = (course: Course) => {
    setSelectedCourse(course)
    setModalOpened(true)
  }

  const handleUnbookmark = async (courseId: number) => {
    try {
      await deleteBookmarkByStudent(studentId, courseId)

      // Close the modal if the unbookmarked course is currently selected
      if (selectedCourse?.id === courseId) {
        setModalOpened(false)
        setSelectedCourse(null)
      }

      // Toggle bookmarksChanged to trigger re-fetch
      setBookmarksChanged((prev) => !prev)
    } catch (error) {
      console.error("Error unbookmarking course:", error)
    }
  }
  // // Load bookmarks from local storage on component mount
  // useEffect(() => {

  //   const savedBookmarks = localStorage.getItem("bookmarkedCourses")
  //   if (savedBookmarks) {
  //     const parsedBookmarks = JSON.parse(savedBookmarks)
  //     setBookmarkedCourses(parsedBookmarks)
  //     console.log("Loaded bookmarks:", parsedBookmarks) // Debug log
  //   } else {
  //     console.log("No bookmarks found in local storage.") // Debug log
  //   }
  // }, [])

  // const openModal = (course: Course) => {
  //   setSelectedCourse(course)
  //   setModalOpened(true)
  // }

  // const handleUnbookmark = (course: Course) => {
  //   console.log("Unbookmarking course:", course) // Debug log
  //   const updatedBookmarks = bookmarkedCourses.filter(
  //     (bookmarked) => bookmarked.id !== course.id
  //   )
  //   console.log("Updated bookmarks:", updatedBookmarks) // Debug log

  //   // Update local storage and state
  //   localStorage.setItem("bookmarkedCourses", JSON.stringify(updatedBookmarks))
  //   setBookmarkedCourses(updatedBookmarks) // This should trigger a rerender

  //   // Close the modal if the unbookmarked course is currently selected
  //   if (selectedCourse?.id === course.id) {
  //     setModalOpened(false)
  //     setSelectedCourse(null)
  //   }
  // }

  return (
    <Container style={{ padding: "50px 20px", maxWidth: "100%" }}>
      <Title order={2} style={{ marginBottom: "20px" }}>
        Bookmarked Courses
      </Title>
      {bookmarkedCourses.length === 0 ? (
        <p>No courses bookmarked yet.</p>
      ) : (
        <Flex
          mih={50}
          gap="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap">
          {bookmarkedCourses.map((course) => (
            <CourseElement
              key={course.id}
              course={course}
              onViewMore={openModal}
              onBookmark={() => handleUnbookmark(course.id)} // Unbookmarking function
              isBookmarked={true} // Always true since these are bookmarked
              careerProspectCount={0}
            />
          ))}
        </Flex>
      )}

      {/* Modal for viewing course details */}
      <CourseViewer
        course={selectedCourse}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Container>
  )
}

export default Bookmark
