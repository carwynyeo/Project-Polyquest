import React, { useState, useEffect } from "react"
import { TextInput, Card, Grid, Container, Title } from "@mantine/core"
import { getCourses, Course } from "@/utils/courses.api" // Adjust the path as needed
import { IoMdSearch } from "react-icons/io"

interface CourseSearchProps {
  onSearch: (searchTerm: string) => void // Define the type for onSearch
}
function CourseSearch({ onSearch }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }
    fetchCourses()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    onSearch(term)
  }
  // // Filter courses directly in the render method
  // const displayedCourses = courses.filter(
  //   (course) =>
  //     course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     course.institution.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  return (
    <Container>
      {/* Wrapper div for custom icon positioning */}
      <div
        style={{ position: "relative", marginBottom: "1rem", width: "100%" }}>
        {/* Icon positioned absolutely inside the wrapper */}
        <IoMdSearch
          size={18}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            color: "#868e96",
            zIndex: 1, // Ensure it doesn't interfere with the input
            pointerEvents: "none" // Ensures the icon doesn't block input clicks
          }}
        />
        <TextInput
          placeholder="Search for courses"
          value={searchTerm}
          onChange={handleSearch}
          mb="md"
          // Adding custom styles for a rounded and modern look
          styles={{
            input: {
              borderRadius: "15px", // Rounded corners
              paddingLeft: "40px", // Add padding for better look
              borderColor: "#FFFFFF", // Light gray border
              transition: "box-shadow 0.1s ease", // Smooth transition on focus
              "&:focus": {
                borderColor: "#FFFFFF" // Change border color on focus
              }
            }
          }}
          size="md"
        />
      </div>
      {/* <Grid>
        {displayedCourses.map((course) => (
          <Grid.Col span={6} key={course.id}>
            <Card shadow="sm" padding="lg">
              <Title order={4}>{course.name}</Title>
              <p>Institution: {course.institution}</p>
              <p>Score: {course.score}</p>
              <p>Career: {course.career}</p>
              <p>Students: {course.students}</p>
            </Card>
          </Grid.Col>
        ))}
      </Grid> */}
    </Container>
  )
}

export default CourseSearch
