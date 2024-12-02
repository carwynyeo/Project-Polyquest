import React, { useState, useEffect } from "react"
import { Card, Button, Flex } from "@mantine/core"
import { CiLaptop } from "react-icons/ci"
import { FiMapPin } from "react-icons/fi"
import { MdBookmark, MdBookmarkBorder } from "react-icons/md" // Import filled and outline bookmark icons
import { Course } from "@/utils/courses.api"

interface CourseElementProps {
  course: Course
  onViewMore: (course: Course) => void
  onBookmark: (course: Course) => void // Add this line
  isBookmarked: boolean
  careerProspectCount: number // Accept the count as a prop
}

const CourseElement: React.FC<CourseElementProps> = ({
  course,
  onViewMore,
  onBookmark,
  isBookmarked, // Use the prop directly
  careerProspectCount
}) => {
  const toggleBookmark = () => {
    onBookmark(course) // Call the onBookmark function passed down as a prop
    // const [isBookmarked, setIsBookmarked] = useState(false)

    // // Load bookmark status from local storage when the component mounts
    // useEffect(() => {
    //   const storedBookmarks = JSON.parse(
    //     localStorage.getItem("bookmarkedCourses") || "[]"
    //   )
    //   const isCourseBookmarked = storedBookmarks.some(
    //     (item: Course) => item.id === course.id
    //   )
    //   setIsBookmarked(isCourseBookmarked)
    // }, [course.id])

    // const toggleBookmark = () => {
    //   // Retrieve the current bookmarks from local storage
    //   const storedBookmarks = JSON.parse(
    //     localStorage.getItem("bookmarkedCourses") || "[]"
    //   )

    //   if (isBookmarked) {
    //     // Remove bookmark if it is currently bookmarked
    //     const updatedBookmarks = storedBookmarks.filter(
    //       (item: Course) => item.id !== course.id
    //     )
    //     localStorage.setItem(
    //       "bookmarkedCourses",
    //       JSON.stringify(updatedBookmarks)
    //     )
    //   } else {
    //     // Add the course to bookmarks if it's not currently bookmarked
    //     const updatedBookmarks = [...storedBookmarks, course]
    //     localStorage.setItem(
    //       "bookmarkedCourses",
    //       JSON.stringify(updatedBookmarks)
    //     )
    //   }

    //   setIsBookmarked(!isBookmarked) // Toggle the bookmark state
  }

  return (
    <Card
      key={course.id}
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      className="relative w-80 shadow-md"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "380px",
        width: "300px"
      }}>
      {/* Bookmark Icon */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => onBookmark(course)} // Toggles the bookmark state
      >
        {isBookmarked ? (
          <MdBookmark className="text-xl text-blue-500" /> // Filled icon for bookmarked
        ) : (
          <MdBookmarkBorder className="text-xl text-indigo-500" /> // Outline icon for not bookmarked
        )}
      </div>

      {/* Icon with Circular Background */}
      <div
        className="flex justify-center items-center bg-blue-50 mb-8"
        style={{
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          margin: "0 auto"
        }}>
        <CiLaptop className="text-4xl text-indigo-500" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-base font-semibold">{course.courseName}</h1>
        <div className="flex justify-center items-center text-gray-500 text-sm mb-3 mt-1">
          <FiMapPin className="mr-1" />
          <span>{course.schoolName}</span>
        </div>
      </div>

      {/* Info Section */}
      <Flex justify="space-around" className="mb-8">
        {/* <div className="text-center">
          <h1 className="text-gray-500 text-xs">ELR2B2</h1>
          <h1 className="font-semibold text-s">{course.score}</h1>
        </div> */}
        <div className="text-center">
          <h1 className="text-gray-500 text-xs">Career Prospects</h1>
          <h1 className="font-semibold text-s">
            {course.careerProspect.length}
          </h1>
        </div>
        <div className="text-center">
          <h1 className="text-gray-500 text-xs">Intake</h1>
          <h1 className="font-semibold text-s">{course.intake}</h1>
        </div>
      </Flex>

      {/* View More Button */}
      <Button
        variant="outline"
        color="indigo"
        fullWidth
        className="flex justify-center items-center font-medium text-indigo-500"
        onClick={() => onViewMore(course)}>
        View more
        <span className="ml-2 text-lg">→</span>
      </Button>
    </Card>
  )
}

export default CourseElement
