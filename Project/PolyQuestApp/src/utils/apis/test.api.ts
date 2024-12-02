import { get, post, patch } from "@/utils/api"

export interface Question {
  id: number
  questionText: string
  createdat: string
  updatedat: number
}

export interface TestResult {
  test_id: number
  quesion_id: number
  response: number
}

export interface testId {
  id: number
  student_id: number
}

// Create a test record
export const createTestResult = async (
  testId: number,
  questionId: number,
  resPonse: number
) => {
  try {
    // Prepare an array to hold the promises
    const response = await post({
      url: `/response/test/${testId}/question/${questionId}/response`, // Correct URL
      body: {
        response: resPonse
      },
      headers: {
        "Content-Type": "application/json" // Ensure correct content type
      }
    })

    // Handle success and errors
    if (!response.success) {
      console.error(`Failed to submit result: ${response.error}`);
      return null;
    }
  } catch (error) {
    console.error("Error creating result:", error);
    return null;
  }
}

// Create a testId record
export const createTestId = async (studentId: number) => {
  try {
    // Prepare an array to hold the promises
    const response = await post({
      url: `/test/student/${studentId}`, // Correct URL
      body: {
        student_id: studentId
      },
      headers: {
        "Content-Type": "application/json" // Ensure correct content type
      }
    })
    // Handle success and errors
    if (!response.success) {
      console.error(`Failed to submit testId: ${response.error}`)
      return null
    }
  } catch (error) {
    console.error("Error creating testId:", error)
    return null
  }
}

// Get a list of all questions
export const getQuestions = async () => {
  try {
    const response = await get<Question[]>({ url: "/question" })
    if (!response.success) throw new Error("Failed to load questions")
    return response.data
  } catch (error) {
    console.error("Error fetching questions:", error)
    return []
  }
}

// Get testId
export const gettestId = async (studentId: number): Promise<number | null> => {
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

// put test complete
export const updateTestComplete = async (testId: number, complete: boolean) => {
  const url = `/test/${testId}/complete`

  try {
    const response = await patch({
      url,
      body: { istestComplete: complete },
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.success) {
      console.error(
        `Failed to update completed for testId ${testId}: ${response.error || "Unknown error"}`
      )
      return null
    }
    return response.data
  } catch (error) {
    console.error("Error updating completed:", error)
    return null
  }
}
