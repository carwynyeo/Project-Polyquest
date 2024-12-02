import { get, post } from "@/utils/api"
import React from "react" // Import React only if you're planning to add hooks or components later
import { reccommendationCourses, testResult } from "./apis/testResult.api"

export interface Rcourses {
  id: number
  courseName: string
  schoolName: string
  score: number
  careerProspect: string[]
  keySkills: string[]
  intake: number
  courseDescription: string
  facultyName: string
}
export interface recommendationTable {
  id: number
  recommendationId: any
  testId: number
  studentId: number
  createdAt: Date
}
export interface testId {
  id: number
  student_id: number
}

//get the latest testId
export const getLatestTestId = async (studentId: number) => {
  try {
    const response = await get<testId>({
      url: `/test/student/${studentId}/latest`
    })

    if (!response.success) throw new Error("Failed to load testId")
    return response.data.id
  } catch (error) {
    console.error("Error fetching testId:", error)
    return null
  }
}

// Get a single student's recommendation id by student ID
export const getRecommendationIDBytestId = async (testId: number) => {
  const response = await get<recommendationTable[]>({
    url: `/recommendation/test/${testId}`
  })
  return response.success ? response.data : []
}

// Get a Recommendation Courses by recommendation ID
export const getRecommendationCoursesByRecommendationID = async (
  recommendationID: number
) => {
  try {
    const response = await get<Rcourses[]>({
      url: `/recommendation/${recommendationID}/courses`
    });
    
    if (!response.success) {
      throw new Error("Failed to fetch courses");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendation courses:", error);
    return [];  // Return an empty array in case of error
  }
};


// Create a course
export const createRecommendedCourse = async (course: Rcourses) => {
  const response = await post<Rcourses>({
    url: "/recommended",
    body: course
  })
  return response.success ? response.data : null
}

// Get a single course by ID
export const getRecommendedCourse = async (studentID: number) => {
  const response = await get<Rcourses[]>({
    url: `/recommendation/student/${studentID}`
  })
  return response.success ? response.data : []
}

// Get a list of all courses
// export const getRecommendedCourses = async () => {
//   const response = await get<RecommendedCourses[]>({ url: "/courses" })
//   return response.success ? response.data : []
// }
