import { useEffect, useState } from "react"
import { Card, Group, Button, Flex } from "@mantine/core"
import { Course } from "@/utils/courses.api"
import { FiBook, FiBriefcase, FiGlobe, FiTrash2 } from "react-icons/fi"

interface TestCardProps {
  recommendationID: number
  createdAt: Date
  onViewMore: (course: Course) => void
  courses: Course[]
  onDelete: () => void // New prop for delete function
}

const TestCard: React.FC<TestCardProps> = ({
  createdAt,
  courses,
  onViewMore,
  onDelete
}) => {
  const getIconForCourse = (courseName: string) => {
    if (
      courseName.includes("Accountancy") ||
      courseName.includes("Accounting")
    ) {
      return <FiBook size={20} color="#3F3EFE" />
    } else if (courseName.includes("Finance")) {
      return <FiBriefcase size={20} color="#00B5D8" />
    } else if (courseName.includes("Engineering")) {
      return <FiGlobe size={20} color="#FFC107" />
    } else {
      return <FiBook size={20} color="#999" />
    }
  }
  return (
    <Card
      shadow="sm"
      radius="md"
      style={{
        padding: "20px",
        width: "100%",
        borderRadius: "15px"
      }}>
      {/* Header Section */}
      <div
        style={{
          padding: "16px",
          background: "linear-gradient(325deg, #3F3EFE, #8A8AFF)",
          borderRadius: "15px"
        }}>
        <Flex justify="space-between" align={"center"}>
          <h1
            style={{
              fontSize: "14px",
              fontWeight: 400,
              opacity: 0.9,
              color: "#FFFFFF"
            }}>
            {createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </h1>

          <Button
            variant="subtle"
            size="s"
            style={{ color: "#FFFFFF", opacity: 0.8 }}
            onClick={onDelete} // Use the onDelete prop here
          >
            <FiTrash2 />
          </Button>
        </Flex>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: 8,
            color: "#FFFFFF"
          }}>
          Engineering
        </h1>
      </div>
      <h1
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#A3AED0",
          marginTop: "15px"
        }}>
        Recommended courses
      </h1>

      {courses.length > 0 ? (
        courses.map((course) => (
          <Flex key={course.id} mt="xs" align="center" justify="space-between">
            <Group>
              <div
                style={{
                  backgroundColor: "#F4F7FE",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                {getIconForCourse(course.courseName)}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1B2559"
                  }}>
                  {course.courseName}
                </h1>
                <h1 style={{ fontSize: "12px", color: "#A3AED0" }}>
                  {course.schoolName}
                </h1>
              </div>
            </Group>
            <Button
              variant="subtle"
              size="xs"
              style={{
                color: "#1B2559",
                opacity: 0.8,
                marginLeft: "8px",
                background: "transparent"
              }}
              onClick={() => onViewMore(course)}>
              View more →
            </Button>
          </Flex>
        ))
      ) : (
        <h1 style={{ fontSize: "14px", color: "#D1D5DB" }}>
          No recommended courses available.
        </h1>
      )}
    </Card>
  )
}

export default TestCard
