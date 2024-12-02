import {
    getLatestTestId,
    getRecommendationIDBytestId,
    getRecommendationCoursesByRecommendationID,
    createRecommendedCourse,
    getRecommendedCourse,
    Rcourses,
    recommendationTable,
    testId
  } from "@/utils/recommended.api"; // Corrected import path
  import { get, post } from "@/utils/api"; // Importing the API utilities
  import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
  
  // Mock the API module
  vi.mock("@/utils/api", () => ({
    get: vi.fn(),
    post: vi.fn(),
  }));
  
  describe("Recommendation Courses API Tests", () => {
    const studentId = 49; // Example student ID
    const recommendationID = 123; // Mock recommendation ID
    const testIdResponse: testId = { id: 1, student_id: studentId }; // Mock test ID response
    const recommendationTableResponse: recommendationTable[] = [
      { id: 1, recommendationId: recommendationID, testId: 1, studentId: studentId, createdAt: new Date() }
    ]; // Mock recommendation table response
    const recommendationCoursesResponse: Rcourses[] = [
      {
        id: 1,
        courseName: "Software Engineering",
        schoolName: "Tech University",
        score: 85,
        careerProspect: ["Developer", "Project Manager"],
        keySkills: ["Programming", "Problem Solving"],
        intake: 2024,
        courseDescription: "An in-depth course on software engineering principles.",
        facultyName: "Dr. John Doe"
      }
    ]; // Mock recommendation courses response
  
    const recommendedCourseResponse: Rcourses = {
      id: 1,
      courseName: "Data Science",
      schoolName: "Data University",
      score: 90,
      careerProspect: ["Data Analyst", "Data Scientist"],
      keySkills: ["Python", "Machine Learning"],
      intake: 2025,
      courseDescription: "Learn the fundamentals of data science.",
      facultyName: "Prof. Jane Doe"
    };
  
    beforeEach(() => {
      vi.clearAllMocks(); // Clear mocks before each test
    });
  
    // Test case for getting the latest test ID for a student
    test("Get latest test ID - success", async () => {
      (get as vi.Mock).mockResolvedValueOnce({ success: true, data: testIdResponse });
  
      const result = await getLatestTestId(studentId);
      expect(result).toBe(testIdResponse.id); // Ensure the result matches the mock test ID
      expect(get).toHaveBeenCalledWith(expect.objectContaining({
        url: `/test/student/${studentId}/latest`,
      }));
    });
  
    // Test case for getting recommendation ID by test ID
    test("Get recommendation ID by test ID - success", async () => {
      (get as vi.Mock).mockResolvedValueOnce({ success: true, data: recommendationTableResponse });
  
      const result = await getRecommendationIDBytestId(testIdResponse.id);
      expect(result).toEqual(recommendationTableResponse); // Ensure the result matches the mock recommendation table
      expect(get).toHaveBeenCalledWith(expect.objectContaining({
        url: `/recommendation/test/${testIdResponse.id}`,
      }));
    });
  
    // Test case for getting recommendation courses by recommendation ID
    test("Get recommendation courses by recommendation ID - success", async () => {
      (get as vi.Mock).mockResolvedValueOnce({ success: true, data: recommendationCoursesResponse });
  
      const result = await getRecommendationCoursesByRecommendationID(recommendationID);
      expect(result).toEqual(recommendationCoursesResponse); // Ensure the result matches the mock courses data
      expect(get).toHaveBeenCalledWith(expect.objectContaining({
        url: `/recommendation/${recommendationID}/courses`,
      }));
    });
  
    // Test case for creating a recommended course
    test("Create recommended course - success", async () => {
      (post as vi.Mock).mockResolvedValueOnce({ success: true, data: recommendedCourseResponse });
  
      const result = await createRecommendedCourse(recommendedCourseResponse);
      expect(result).toEqual(recommendedCourseResponse); // Ensure the result matches the mock course data
      expect(post).toHaveBeenCalledWith(expect.objectContaining({
        url: "/recommended",
        body: recommendedCourseResponse,
      }));
    });
  
    // Test case for getting a recommended course by student ID
    test("Get recommended course - success", async () => {
      (get as vi.Mock).mockResolvedValueOnce({ success: true, data: [recommendedCourseResponse] });
  
      const result = await getRecommendedCourse(studentId);
      expect(result).toEqual([recommendedCourseResponse]); // Ensure the result matches the mock course data
      expect(get).toHaveBeenCalledWith(expect.objectContaining({
        url: `/recommendation/student/${studentId}`,
      }));
    });
  
    // Test case for error handling when fetching latest test ID
    test("Get latest test ID - error", async () => {
      (get as vi.Mock).mockRejectedValueOnce(new Error("Network Error"));
  
      const result = await getLatestTestId(studentId);
      expect(result).toBeNull(); // Ensure null is returned in case of error
    });
  
    // Test case for error handling when getting recommendation courses
    test("Get recommendation courses - error", async () => {
      // Mock rejection for a network error
      (get as vi.Mock).mockRejectedValueOnce(new Error("Network Error"));
  
      // Ensure that the error is caught and an empty array is returned
      const result = await getRecommendationCoursesByRecommendationID(recommendationID);
      expect(result).toEqual([]); // Ensure an empty array is returned in case of error
    });
  });
  