import { get, post, patch, del } from "@/utils/api"

export interface AcadResult {
  id: any | undefined
  grade: string
  student_id: number
  subjectname: string
  subjectName: string
}

// Create academic results
export const createAcadResult = async (result: any[], studentId: number) => {
  try {
    const resultPromises = result.map(
      async (result: { subjectname: any; grade: any; student_id: any }) => {
        const response = await post({
          url: `/student-acad-performance/student/${studentId}`,
          body: {
            subjectName: result.subjectname,
            grade: result.grade,
            student_id: result.student_id
          },
          headers: {
            "Content-Type": "application/json"
          }
        })

        if (!response.success) {
          console.error(
            `Failed to submit result: ${response.error || "Unknown error"}`
          )
          return null
        }
        return response.data // Assuming response.data contains the created result object
      }
    )

    const createdResults = await Promise.all(resultPromises)
    return createdResults.filter((res) => res !== null)
  } catch (error) {
    console.error("Error creating result:", error)
    return null
  }
}

// Get all academic results for a student
export const getAcadResult = async (student_id: number) => {
  try {
    const response = await get<AcadResult[]>({
      url: `/student-acad-performance/student/${student_id}`
    })
    if (!response.success) throw new Error("Failed to load acadResult")
    return response.data
  } catch (error) {
    console.error("Error fetching acadResult:", error)
    return []
  }
}

// Get all academic subjects
export const getAcadSubject = async () => {
  try {
    const response = await get<AcadResult[]>({
      url: "/acad-performance/get-all-acad-performances"
    })
    if (!response.success) throw new Error("Failed to load acadSubject")
    return response.data
  } catch (error) {
    console.error("Error fetching acadSubject:", error)
    return []
  }
}

// Update an academic result
export const updateAcadResult = async (
  resultId: any,
  studentId: number,
  updatedData: { subjectName: any; grade: any }
) => {
  const url = `/student-acad-performance/student/${studentId}/id/${resultId}`

  try {
    const response = await patch({
      url,
      body: updatedData
    })

    if (!response.success) {
      console.error(
        `Failed to update result for ${updatedData.subjectName}: ${response.error || "Unknown error"}`
      )
      return null
    }
    return response.data // Assuming response.data contains the updated result object
  } catch (error) {
    console.error("Error updating results:", error)
    return null
  }
}

// Delete an academic result
export const deleteAcadResult = async (id: number) => {
  try {
    const response = await del({
      url: `/student-acad-performance/${id}`
    })

    if (!response.success) {
      console.error(
        `Failed to delete result: ${response.error || "Unknown error"}`
      )
      return null
    }
    return response.data
  } catch (error) {
    console.error("Error deleting result:", error)
    return null
  }
}
