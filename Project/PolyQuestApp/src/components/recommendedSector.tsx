import React, { useEffect, useState } from "react"
import { getRecommendedCourse, Rcourses } from "@/utils/recommended.api"
import {
  Card,
  Text,
  Button,
  Container,
  Flex,
  Box,
  Progress
} from "@mantine/core"
import { FiArrowRight, FiBookmark } from "react-icons/fi"
import { CiLaptop } from "react-icons/ci"

interface RecommendedCoursesProps {
  studentID: number
  searchTerm: string // Add searchTerm prop
  recommendedCourses: Rcourses[]
}
interface SectorData {
  name: string
  score: number
}

const transformData = (courses: Rcourses[]): SectorData[] => {
  // Count occurrences of each faculty
  const facultyCount: { [key: string]: number } = {}
  courses.forEach((course) => {
    console.log(course) // This will log each course to check its properties
  })
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

const RecommendedSector: React.FC<RecommendedCoursesProps> = ({
  studentID,
  searchTerm,
  recommendedCourses
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (recommendedCourses.length === 0) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [recommendedCourses])

  if (loading) return <p>Loading recommended courses...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  // // Filter recommended courses based on the search term
  // const filteredCourses = recommendedCourses.filter(
  //   (course) =>
  //     course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     course.institution.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  console.log(recommendedCourses)

  // Transform data for the chart
  const sectorData = transformData(recommendedCourses)

  console.log(sectorData)
  // Find the largest sector score
  const maxScore = Math.max(...sectorData.map((sector) => sector.score))

  return (
    <Container
      style={{
        maxWidth: "100%",
        overflow: "hidden" // Prevent overflow
      }}>
      {/* Recommended Sectors Bar Chart */}
      <Box
        className="p-6 border rounded-lg shadow-sm bg-white mb-8"
        style={{
          borderRadius: "25px",
          padding: "40px", // Controls padding inside the box
          maxWidth: "100%",
          margin: "20px auto", // Equal margin around the box
          position: "relative" // Optional for positioning elements inside
        }}>
        <div className="space-y-3">
          {sectorData.map((sector, index) => (
            <div
              key={index}
              className="flex items-center"
              style={{ marginBottom: "10px" }} // Adjust as necessary
            >
              <Text
                className="flex-none text-sm font-semibold text-gray-700 text-left"
                style={{ width: "150px" }}>
                {sector.name}
              </Text>
              <div className="flex-1 mx-1">
                <Progress
                  value={sector.score}
                  color="#3F3EFE" // Set color to blue
                  size="lg" // Set size to lg for larger bars
                  radius="lg"
                  style={{ height: "17px" }} // Set height to make the bars thicker
                />
              </div>
              <Text className="flex-none w-10 text-sm font-medium text-gray-700">
                {Math.round(sector.score)}%
              </Text>
            </div>
          ))}
        </div>
        <div className="text-right mt-6">
          <Text size="sm" style={{ textAlign: "right" }}>
            Compatibility
          </Text>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              textAlign: "right"
            }}>
            {Math.round(maxScore)}% {/* Display the maximum sector score */}
          </h1>
        </div>
      </Box>
    </Container>
  )
}
export default RecommendedSector
