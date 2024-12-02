import {
  createAcadResult,
  getAcadResult,
  getAcadSubject,
  updateAcadResult,
  deleteAcadResult
} from "@/utils/apis/acadResult.api"
import { get, post, patch, del } from "@/utils/api"
import { expect, test, describe, vi, beforeEach } from "vitest"

// Mock all functions from the API module
vi.mock("@/utils/api", () => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  del: vi.fn()
}))

describe("Academic Results API Tests", () => {
  const studentId = 49 // Example student ID for testing
  const resultData = [
    { subjectname: "Geography", grade: "A1", student_id: studentId }
  ] // Example input for creating academic results
  const mockResult = {
    id: 1,
    subjectName: "Geography",
    grade: "A1",
    student_id: studentId
  } // Mocked result response for API responses

  beforeEach(() => {
    vi.clearAllMocks() // Clear mocks before each test to prevent interference from previous tests
  })

  // Test for successful creation of academic results
  test("Create academic results - success", async () => {
    // Mock successful response for post request
    ;(post as vi.Mock).mockResolvedValue({ success: true, data: mockResult })

    const createdResults = (await createAcadResult(
      resultData,
      studentId
    )) as any // Call function to create results
    expect(createdResults).toHaveLength(1) // Expect one result to be created
    expect(createdResults[0].subjectName).toBe("Geography") // Check if the subject name matches
  })

  // Test for failure case when creating academic results
  test("Create academic results - failure", async () => {
    // Mock a failure response
    ;(post as vi.Mock).mockResolvedValue({ success: false })

    const createdResults = await createAcadResult(resultData, studentId) // Call function to create results
    expect(createdResults).toEqual([]) // Expect an empty array to be returned on failure
  })

  // Test for successfully fetching academic results for a student
  test("Get academic results - success", async () => {
    // Mock successful get request response with academic results
    ;(get as vi.Mock).mockResolvedValue({ success: true, data: [mockResult] })

    const results = await getAcadResult(studentId) // Fetch results for the student
    expect(results).toHaveLength(1) // Expect one result to be returned
    expect(results[0].grade).toBe("A1") // Check if the grade matches the expected value
  })

  // Test for failure case when fetching academic results
  test("Get academic results - failure", async () => {
    // Mock a failure response
    ;(get as vi.Mock).mockResolvedValue({ success: false })

    const results = await getAcadResult(studentId) // Fetch results for the student
    expect(results).toEqual([]) // Expect an empty array to be returned on failure
  })

  // Test for successfully fetching academic subjects
  test("Get academic subjects - success", async () => {
    const mockSubjects = [
      { subjectName: "Geography" },
      { subjectName: "Literature" }
    ] // Mocked data for academic subjects
    ;(get as vi.Mock).mockResolvedValue({ success: true, data: mockSubjects }) // Mock a successful response for subjects

    const subjects = await getAcadSubject() // Fetch academic subjects
    expect(subjects).toHaveLength(2) // Expect two subjects to be returned
    expect(subjects[0].subjectName).toBe("Geography") // Check if the first subject name matches
  })

  // Test for failure case when fetching academic subjects
  test("Get academic subjects - failure", async () => {
    // Mock a failure response
    ;(get as vi.Mock).mockResolvedValue({ success: false })

    const subjects = await getAcadSubject() // Fetch academic subjects
    expect(subjects).toEqual([]) // Expect an empty array to be returned on failure
  })

  // Test for successfully updating an academic result
  test("Update academic result - success", async () => {
    const updatedData = { subjectName: "Geography", grade: "A2" } // Data to update the result with
    ;(patch as vi.Mock).mockResolvedValue({
      success: true,
      data: { ...mockResult, grade: "A2" }
    }) // Mock a successful update response

    const updatedResult = await updateAcadResult(1, studentId, updatedData) // Call function to update result
    expect(updatedResult).toBeDefined() // Ensure the updated result is defined
    expect(updatedResult.grade).toBe("A2") // Check if the grade has been updated correctly
  })

  // Test for failure case when updating an academic result
  test("Update academic result - failure", async () => {
    // Mock a failure response
    ;(patch as vi.Mock).mockResolvedValue({ success: false })

    const updatedResult = await updateAcadResult(1, studentId, {
      subjectName: "Geography",
      grade: "A2"
    }) // Call function to update result
    expect(updatedResult).toBeNull() // Expect null to be returned on failure
  })

  // Test for successfully deleting an academic result
  test("Delete academic result - success", async () => {
    ;(del as vi.Mock).mockResolvedValue({
      success: true,
      data: { message: "Deleted successfully" }
    }) // Mock a successful delete response

    const deletedResult = await deleteAcadResult(1) // Call function to delete result
    expect(deletedResult).toBeDefined() // Ensure the delete response is defined
    expect(deletedResult).toEqual({ message: "Deleted successfully" }) // Check if the response matches the expected message
  })

  // Test for failure case when deleting an academic result
  test("Delete academic result - failure", async () => {
    // Mock a failure response
    ;(del as vi.Mock).mockResolvedValue({ success: false })

    const deletedResult = await deleteAcadResult(1) // Call function to delete result
    expect(deletedResult).toBeNull() // Expect null to be returned on failure
  })
})
