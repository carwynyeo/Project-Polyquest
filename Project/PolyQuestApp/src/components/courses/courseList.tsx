import React, { useEffect, useState } from "react"
import { SimpleGrid, Container, Flex } from "@mantine/core"
import CourseElement from "./courseElement" // Import the CourseElement component
import CourseViewer from "./courseViewer" // Import the CourseViewer component
import { getCourses, Course } from "@/utils/courses.api"

interface CourseListProps {
  searchTerm: string
  onBookmarkToggle: (course: Course) => void // Add this line
  bookmarkedCourses: Course[] // Add this line
}
const CourseList: React.FC<CourseListProps> = ({
  searchTerm,
  onBookmarkToggle,
  bookmarkedCourses
}) => {
  // const dummyCourses: Course[] = [
  //   {
  //     id: 1,
  //     courseName: "Financial Informatics",
  //     schoolName: "Nanyang Polytechnic",
  //     score: 95,
  //     career: 20,
  //     students: 100,
  //     description:
  //       "Gain skills mastery in app development, blockchain, and data analytics, while sharpening your business acumen and financial knowledge. Ride the waves of the fintech revolution.\n\nPlus, earn industry-recognised certifications from organisations such as Oracle Academy and Google Cloud.",
  //     careerProspect: [
  //       "Business analyst",
  //       "E-commerce consultant",
  //       "Fintech specialist",
  //       "Tech innovator"
  //     ],
  //     keySkills: [
  //       "Web Development",
  //       "UX Design in Web Development",
  //       "Cybersecurity Technologies & Ethics",
  //       "Applied Mathematics In Computing"
  //     ],
  //     link: "https://www.nyp.edu.sg"
  //   },
  //   {
  //     id: 2,
  //     courseName: "Business",
  //     schoolName: "Temasek Polytechnic",
  //     score: 90,
  //     career: 20,
  //     students: 150,
  //     description:
  //       "Our course offers a dynamic and future-oriented curriculum designed to cater to the evolving demands of industries in Singapore and the broader region.\n\nThrough personalised learning experiences, we equip students with multi-disciplinary and transferable skill sets necessary to excel in a rapidly changing workforce and thrive in diverse roles and industries.",
  //     careerProspect: [
  //       "Accountant",
  //       "Product Innovation",
  //       "Data Analyst",
  //       "Business Analyst"
  //     ],
  //     keySkills: [
  //       "Accounting",
  //       "Data Analytics",
  //       "Human Resource",
  //       "Digital Marketing"
  //     ],
  //     link: "https://www.tp.edu.sg"
  //   },
  //   {
  //     id: 3,
  //     courseName: "Aerospace Electronics",
  //     schoolName: "Nanyang Polytechnic",
  //     score: 92,
  //     career: 20,
  //     students: 80,
  //     description:
  //       "Growing up, were you fascinated with how a heavy machine can fly? Do you ever imagine yourself working on the next generation of aircraft? Then come on board the Diploma in Aerospace Engineering (AEG).\n\nAs global travel resumes, the demand for aerospace professionals in the industry is set to soar. With this broad-based diploma, you will gain a strong engineering foundation and discover how you can play a role in this fast-growing sector!",
  //     careerProspect: [
  //       "Quality Engineer",
  //       "Technical Service Engineer",
  //       "Workshop Engineer"
  //     ],
  //     keySkills: [
  //       "Maintenance, Repair and Overhaul (MRO)",
  //       "Data Analytics",
  //       "Mechanical Engineering Fundamentals",
  //       "Electrical Engineering Fundamentals"
  //     ],
  //     link: "https://www.nyp.edu.sg"
  //   }
  // ]
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null) // Track selected course
  const [modalOpened, setModalOpened] = useState(false) // Track modal state

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

  const openModal = (course: Course) => {
    setSelectedCourse(course)
    setModalOpened(true)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  // Filter courses based on the search term
  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        {filteredCourses.map((course) => (
          <CourseElement
            key={course.id}
            course={course}
            onViewMore={openModal} // Pass the openModal function as a prop
            onBookmark={onBookmarkToggle}
            isBookmarked={bookmarkedCourses.some(
              (item) => item.id === course.id
            )} // Corrected line
            careerProspectCount={0}
          />
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

export default CourseList
