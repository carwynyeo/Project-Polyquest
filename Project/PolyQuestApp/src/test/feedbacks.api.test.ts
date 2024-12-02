import { createFeedback, createFeedbackid, getFeedbackQuestions, FeedbackAnswer } from "@/utils/feedbacks.api";
import { post, get } from "@/utils/api"; // Import API utilities for sending requests
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";

// Mock the API module to simulate API responses
vi.mock("@/utils/api", () => ({
  post: vi.fn(),
  get: vi.fn(),
}));

describe("Feedback API Tests", () => {
  // Test data
  const feedbackAnswers: FeedbackAnswer[] = [
    { feedbackId: 1, questionID: 1, answer: 5 },
    { feedbackId: 1, questionID: 2, answer: 4 },
  ];

  const studentID = 49; // Example student ID
  const feedbackIdResponse = { success: true, data: { id: 123 } }; // Mocked feedback ID response
  const feedbackQuestionResponse = [
    { id: 1, options: 3, message: "How was your experience?", createdAt: new Date(), updatedAt: new Date() }
  ]; // Mocked feedback question data

  let consoleErrorSpy: vi.SpiedFunction;

  // Setup and teardown for mocking console.error
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks between tests
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Restore original console.error after each test
  });

  // Test for successful creation of feedback answers
  test("Create feedback - success", async () => {
    // Mock successful response for feedback submission
    (post as vi.Mock).mockResolvedValueOnce({ success: true, data: feedbackAnswers });

    await createFeedback(feedbackAnswers); // Call the function to create feedback

    // Check if the correct number of requests were made
    expect(post).toHaveBeenCalledTimes(feedbackAnswers.length);

    // Verify that the URL and request body are correct for each feedback answer
    feedbackAnswers.forEach((feedbackAnswer) => {
      expect(post).toHaveBeenCalledWith(expect.objectContaining({
        url: `/feedback-answer/feedback/${feedbackAnswer.feedbackId}/question/${feedbackAnswer.questionID}/answer`,
        body: { answer: feedbackAnswer.answer },
      }));
    });
  });

  // Test for feedback creation failure
  test("Create feedback - failure", async () => {
    // Mock failure response
    (post as vi.Mock).mockResolvedValueOnce({ success: false });

    await createFeedback(feedbackAnswers); // Call the function to create feedback

    // Verify that error logging occurs when creation fails
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  // Test for creating feedback ID
  test("Create feedback ID - success", async () => {
    // Mock response for feedback ID creation
    (post as vi.Mock).mockResolvedValueOnce(feedbackIdResponse);

    const feedbackId = await createFeedbackid(studentID);
    expect(feedbackId).toBe(123); // Assert that the returned feedback ID is correct
  });

  // Test for successfully fetching feedback questions
  test("Get feedback questions - success", async () => {
    // Mock response for fetching feedback questions
    (get as vi.Mock).mockResolvedValueOnce({ success: true, data: feedbackQuestionResponse });

    const questions = await getFeedbackQuestions();
    expect(questions).toEqual(feedbackQuestionResponse); // Ensure the questions are returned correctly
  });

  // Test for failure when fetching feedback questions
  test("Get feedback questions - failure", async () => {
    // Mock failure response for fetching feedback questions
    (get as vi.Mock).mockResolvedValueOnce({ success: false, data: [] });

    const questions = await getFeedbackQuestions();
    expect(questions).toEqual([]); // Ensure an empty array is returned on failure
  });

  // Test for handling network errors when fetching feedback questions
  test("Get feedback questions - exception handling", async () => {
    // Mock rejection for a network error
    (get as vi.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const questions = await getFeedbackQuestions();
    expect(questions).toEqual([]); // Ensure an empty array is returned in case of an error
  });
});
