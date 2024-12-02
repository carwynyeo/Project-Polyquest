import { get, post } from "@/utils/api"
import React from "react" // Import React only if you're planning to add hooks or components later

export interface Course {
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

// Create a course
export const createCourse = async (course: Course) => {
  const response = await post<Course>({ url: "/course", body: course })
  return response.success ? response.data : null
}

// Get a single course by ID
export const getCourseById = async (id: number) => {
  const response = await get<Course>({ url: `/course/${id}` })
  return response.success ? response.data : null
}

// Get a list of all courses
export const getCourses = async () => {
  try {
    const response = await get<Course[]>({ url: "/course" })
    if (!response.success) throw new Error("Failed to load courses")
    return response.data
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
  }
}
