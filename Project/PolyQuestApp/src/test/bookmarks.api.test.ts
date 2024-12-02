import { createBookmark, getBookmarksByStudent, deleteBookmarkByStudent } from "@/utils/bookmark.api";
import { get, post, del } from "@/utils/api";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Mock all functions from the API module
vi.mock("@/utils/api", () => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
}));

describe("Bookmark API Tests", () => {
  const studentId = 49; // Example student ID for testing
  const courseId = 101; // Example course ID for testing
  const mockBookmark = { 
    id: 1, 
    studentID: studentId, 
    course: courseId, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  }; // Mocked bookmark response for API responses

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test to prevent interference from previous tests
  });

  // Test for successfully creating a bookmark
  test("Create bookmark - success", async () => {
    // Mock successful response for post request
    (post as vi.Mock).mockResolvedValue({ success: true, data: mockBookmark });

    const createdBookmark = await createBookmark(studentId, courseId); // Call function to create bookmark
    expect(createdBookmark).toBeDefined(); // Expect a bookmark to be created
    expect(createdBookmark?.studentID).toBe(studentId); // Check if the student ID matches
    expect(createdBookmark?.course).toBe(courseId); // Check if the course ID matches
  });

  // Test for failure case when creating a bookmark
  test("Create bookmark - failure", async () => {
    // Mock a failure response
    (post as vi.Mock).mockResolvedValue({ success: false });

    const createdBookmark = await createBookmark(studentId, courseId); // Call function to create bookmark
    expect(createdBookmark).toBeNull(); // Expect null to be returned on failure
  });

  // Test for successfully fetching bookmarks for a student
  test("Get bookmarks by student - success", async () => {
    // Mock successful get request response with bookmarks
    (get as vi.Mock).mockResolvedValue({ success: true, data: [mockBookmark] });

    const bookmarks = await getBookmarksByStudent(studentId); // Fetch bookmarks for the student
    expect(bookmarks).toHaveLength(1); // Expect one bookmark to be returnedq
    expect(bookmarks[0].studentID).toBe(studentId); // Check if the student ID matches
    expect(bookmarks[0].course).toBe(courseId); // Check if the course ID matches
  });

  // Test for failure case when fetching bookmarks
  test("Get bookmarks by student - failure", async () => {
    // Mock a failure response
    (get as vi.Mock).mockResolvedValue({ success: false });

    const bookmarks = await getBookmarksByStudent(studentId); // Fetch bookmarks for the student
    expect(bookmarks).toEqual([]); // Expect an empty array to be returned on failure
  });

  // Test for successfully deleting a bookmark by student and course ID
  test("Delete bookmark - success", async () => {
    // Mock successful delete response
    (del as vi.Mock).mockResolvedValue({ success: true });

    const deleteResult = await deleteBookmarkByStudent(studentId, courseId); // Call function to delete bookmark
    expect(deleteResult).toBe(true); // Expect true to be returned on successful delete
  });

  // Test for failure case when deleting a bookmark
  test("Delete bookmark - failure", async () => {
    // Mock a failure response
    (del as vi.Mock).mockResolvedValue({ success: false });

    const deleteResult = await deleteBookmarkByStudent(studentId, courseId); // Call function to delete bookmark
    expect(deleteResult).toBe(false); // Expect false to be returned on failure
  });
});
