import { createCourse, getCourseById, getCourses, Course } from "@/utils/courses.api";
import { post, get } from "@/utils/api"; // Importing the API utilities
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";

// Mock the API module
vi.mock("@/utils/api", () => ({
  post: vi.fn(),
  get: vi.fn(),
}));

describe("Course API Tests", () => {
  // Test data
  const course: Course = {
    id: 1,
    courseName: "Software Engineering",
    schoolName: "Tech University",
    score: 85,
    careerProspect: ["Developer", "Project Manager"],
    keySkills: ["Programming", "Problem Solving", "Project Management"],
    intake: 2024,
    courseDescription: "An in-depth course on software engineering principles.",
    facultyName: "Dr. John Doe",
  };

  const courseResponse = { success: true, data: course }; // Mocked response for creating a course
  const courseListResponse = { success: true, data: [course] }; // Mocked list of courses response

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  // Test case for successfully creating a course
  test("Create course - success", async () => {
    // Mock a successful response from the post request
    (post as vi.Mock).mockResolvedValueOnce(courseResponse);

    const result = await createCourse(course); // Call the createCourse function
    expect(result).toEqual(course); // Ensure the result matches the course data
    expect(post).toHaveBeenCalledWith(expect.objectContaining({
      url: "/course",
      body: course,
    })); // Verify that the correct URL and body were passed to the API
  });

  // Test case for creating a course - failure
  test("Create course - failure", async () => {
    // Mock a failure response
    (post as vi.Mock).mockResolvedValueOnce({ success: false });

    const result = await createCourse(course); // Call the createCourse function
    expect(result).toBeNull(); // Ensure null is returned on failure
  });

  // Test case for getting a course by ID
  test("Get course by ID - success", async () => {
    // Mock a successful response from the get request
    (get as vi.Mock).mockResolvedValueOnce(courseResponse);

    const result = await getCourseById(1); // Call the getCourseById function
    expect(result).toEqual(course); // Ensure the result matches the course data
    expect(get).toHaveBeenCalledWith(expect.objectContaining({
      url: "/course/1",
    })); // Verify that the correct URL was used for the API call
  });

  // Test case for getting a course by ID - failure
  test("Get course by ID - failure", async () => {
    // Mock a failure response
    (get as vi.Mock).mockResolvedValueOnce({ success: false });

    const result = await getCourseById(1); // Call the getCourseById function
    expect(result).toBeNull(); // Ensure null is returned on failure
  });

  // Test case for getting all courses - success
  test("Get courses - success", async () => {
    // Mock a successful response for getting the list of courses
    (get as vi.Mock).mockResolvedValueOnce(courseListResponse);

    const result = await getCourses(); // Call the getCourses function
    expect(result).toEqual([course]); // Ensure the result matches the course list
    expect(get).toHaveBeenCalledWith(expect.objectContaining({
      url: "/course",
    })); // Verify that the correct URL was used for the API call
  });

  // Test case for getting all courses - failure
  test("Get courses - failure", async () => {
    // Mock a failure response
    (get as vi.Mock).mockResolvedValueOnce({ success: false, data: [] });

    const result = await getCourses(); // Call the getCourses function
    expect(result).toEqual([]); // Ensure an empty array is returned on failure
  });

  // Test case for exception handling when fetching courses
  test("Get courses - exception handling", async () => {
    // Mock rejection for a network error
    (get as vi.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const result = await getCourses(); // Call the getCourses function
    expect(result).toEqual([]); // Ensure an empty array is returned in case of an error
  });
});
