import { get, post } from "./api" // Import the post utility

// Interface to represent each feedback answer
export interface FeedbackAnswer {
  feedbackId: number
  questionID: number
  answer: number
}

export interface FeedbackQuestion {
  options: number
  id: number
  message: string
  createdAt: Date
  updatedAt: Date
}

// Function to create feedback answers
export const createFeedback = async (feedbackAnswers: FeedbackAnswer[]) => {
  try {
    // Prepare an array to hold the promises
    const feedbackPromises = feedbackAnswers.map(async (feedbackAnswer) => {
      const response = await post({
        url: `/feedback-answer/feedback/${feedbackAnswer.feedbackId}/question/${feedbackAnswer.questionID}/answer`, // Correct URL
        body: {
          answer: feedbackAnswer.answer
        },
        headers: {
          "Content-Type": "application/json" // Ensure correct content type
        }
      })

      // Handle success and errors
      if (!response.success) {
        console.error(
          `Failed to submit feedback for question ${feedbackAnswer.questionID}: ${response.error}`
        )
      }
    })

    // Wait for all promises to resolve
    await Promise.all(feedbackPromises)
  } catch (error) {
    console.error("Error creating feedback:", error)
    return null
  }
}

// Create a new feedback entry
export const createFeedbackid = async (studentID: number) => {
  const response = await post<{ id: number }>({
    url: `/feedback/student/${studentID}`,
    body: { message: "because carwyn is stupid" }
  })
  return response.success ? response.data.id : null
}

// Get a list of all feedback questions
export const getFeedbackQuestions = async (): Promise<FeedbackQuestion[]> => {
  try {
    const response = await get<FeedbackQuestion[]>({
      url: "/feedback-question"
    }) // Adjust URL as necessary
    if (!response.success) throw new Error("Failed to load feedback questions")
    return response.data
  } catch (error) {
    console.error("Error fetching feedback questions:", error)
    return []
  }
}
