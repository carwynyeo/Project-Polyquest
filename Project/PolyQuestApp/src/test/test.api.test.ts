import { createTestResult, createTestId, getQuestions, gettestId, updateTestComplete } from "@/utils/apis/test.api";
import { get, post, patch } from "@/utils/api";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Mock all functions from the API module
vi.mock("@/utils/api", () => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

describe("Test API Tests", () => {
  const studentId = 49; // Example student ID for testing
  const testId = 1;
  const questionId = 10;
  const responseValue = 5;
  const questionData = [
    { id: 1, questionText: "How much do you enjoy subjects like Math and Science? (0 = Not at all, 5 = Very much)", createdat: "1730038282000", updatedat: null },
    { id: 2, questionText: "How interested are you in pursuing Engineering or Technical fields? (0 = Not interested, 5 = Very interested)", createdat: "1730038283000", updatedat: null },
  ];

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test to prevent interference from previous tests
  });

  // Test for creating test result - success
  test("Create test result - success", async () => {
    // Mock successful response for post request
    (post as vi.Mock).mockResolvedValue({ success: true });

    const result = await createTestResult(testId, questionId, responseValue);
    expect(result).toBeUndefined(); // Expect no error on success
    expect(post).toHaveBeenCalledTimes(1); // Ensure the post function is called once
  });

  // Test for creating test result - failure
  test("Create test result - failure", async () => {
    // Mock a failure response
    (post as vi.Mock).mockResolvedValue({ success: false });

    const result = await createTestResult(testId, questionId, responseValue);
    expect(result).toBeNull(); // Expect `null` on failure
  });

  // Test for creating testId record - success
  test("Create testId record - success", async () => {
    (post as vi.Mock).mockResolvedValue({ success: true });

    const result = await createTestId(studentId);
    expect(result).toBeUndefined(); // Expect no error on success
    expect(post).toHaveBeenCalledTimes(1); // Ensure the post function is called once
  });

  // Test for creating testId record - failure
  test("Create testId record - failure", async () => {
    (post as vi.Mock).mockResolvedValue({ success: false });

    const result = await createTestId(studentId);
    expect(result).toBeNull(); // Expect `null` on failure
  });

  // Test for getting questions - success
  test("Get questions - success", async () => {
    (get as vi.Mock).mockResolvedValue({ success: true, data: questionData });

    const questions = await getQuestions();
    expect(questions).toHaveLength(2); // Expect two questions to be returned
    expect(questions[0].questionText).toBe("How much do you enjoy subjects like Math and Science? (0 = Not at all, 5 = Very much)");
  });

  // Test for getting questions - failure
  test("Get questions - failure", async () => {
    (get as vi.Mock).mockResolvedValue({ success: false });

    const questions = await getQuestions();
    expect(questions).toEqual([]); // Expect an empty array on failure
  });

  // Test for getting testId - success
  test("Get testId - success", async () => {
    (get as vi.Mock).mockResolvedValue({ success: true, data: { id: testId } });

    const result = await gettestId(studentId);
    expect(result).toBe(testId); // Expect to receive the testId
  });

  // Test for getting testId - failure
  test("Get testId - failure", async () => {
    (get as vi.Mock).mockResolvedValue({ success: false });

    const result = await gettestId(studentId);
    expect(result).toBeNull(); // Expect `null` on failure
  });

  // Test for updating test completion - success
  test("Update test complete - success", async () => {
    (patch as vi.Mock).mockResolvedValue({ success: true, data: { complete: true } });

    const result = await updateTestComplete(testId, true);
    expect(result).toEqual({ complete: true });
    expect(patch).toHaveBeenCalledTimes(1); // Ensure the patch function is called once
  });

  // Test for updating test completion - failure
  test("Update test complete - failure", async () => {
    (patch as vi.Mock).mockResolvedValue({ success: false });

    const result = await updateTestComplete(testId, true);
    expect(result).toBeNull(); // Expect `null` on failure
  });
});
