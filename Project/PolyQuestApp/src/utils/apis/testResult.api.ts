import { del, get, patch, post } from "@/utils/api"

export interface testResult {
  id: number
  testId: number
  studentID: number
  createdAt: Date
}

export interface reccommendationCourses {
  id: number
  course: number
}

// Get a single student's recommendation id by student ID
export const getRecommendationIDByStudent = async (studentID: number) => {
  const response = await get<testResult[]>({
    url: `/recommendation/student/${studentID}`
  })
  return response.success ? response.data : []
}

// Get a Recommendation Courses by reommendation ID
export const getRecommendationCoursesByRecommendationID = async (
  recommendationID: number
) => {
  const response = await get<reccommendationCourses[]>({
    url: `/recommendation/${recommendationID}/courses`
  })
  console.log(response)
  return response.success ? response.data : []
}

// Delete a test result by test result ID
export const deleteTestResult = async (testId: number) => {
  const response = await del({
    url: `/test/${testId}`
  })
  return response.success
}
