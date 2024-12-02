import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@mantine/core"
import {
  createFeedback,
  createFeedbackid,
  FeedbackQuestion,
  getFeedbackQuestions
} from "../utils/feedbacks.api" // Import API method
// Import images for feedback options
import option1 from "./feedback-options/option1.png"
import option1Selected from "./feedback-options/option1selected.png"
import option2 from "./feedback-options/option2.png"
import option2Selected from "./feedback-options/option2selected.png"
import option3 from "./feedback-options/option3.png"
import option3Selected from "./feedback-options/option3selected.png"
import option4 from "./feedback-options/option4.png"
import option4Selected from "./feedback-options/option4selected.png"
import option5 from "./feedback-options/option5.png"
import option5Selected from "./feedback-options/option5selected.png"
import { useStudent } from "@/hooks/useStudent"

// Define the route
export const Route = createFileRoute("/contact")({
  component: ContactUs
})

// OptionList Component

function OptionList({ questionId, selectedOption, onSelect }) {
  const options = [1, 2, 3, 4, 5] // Hardcoded options (1 to 5)
  const getImage = (value) => {
    switch (value) {
      case 1:
        return selectedOption === 1 ? option1Selected : option1
      case 2:
        return selectedOption === 2 ? option2Selected : option2
      case 3:
        return selectedOption === 3 ? option3Selected : option3
      case 4:
        return selectedOption === 4 ? option4Selected : option4
      case 5:
        return selectedOption === 5 ? option5Selected : option5
      default:
        return option1 // Fallback just in case
    }
  }

  return (
    <div className="grid grid-cols-5 gap-6 mt-4">
      {options.map((value) => (
        <div
          key={value}
          className={`cursor-pointer flex items-center justify-center`}
          onClick={() => onSelect(questionId, value)}>
          <img
            src={getImage(value)}
            alt={`Option ${value}`}
            className="h-32 w-32 object-contain hover:transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  )
}
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}
// FeedbackForm Component
function FeedbackForm() {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false) // State to track submission
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]) // Explicitly set the type to FeedbackQuestion[]
  const [loading, setLoading] = useState(true) // State for loading
  // Fetch questions from the backend on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const feedbackQuestions = await getFeedbackQuestions()
        setQuestions(feedbackQuestions)
      } catch (error) {
        console.error("Error fetching feedback questions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])
  // Group questions into sections of two
  const splitquestion = chunkArray(questions, 2)
  const currentQuestions = splitquestion[currentSection] || []
  const sections = [
    {
      sectionId: 1,
      title: "User Experience"
    },
    {
      sectionId: 2,
      title: "Test Quality"
    },
    {
      sectionId: 3,
      title: "Recommendation Accuracy"
    },
    {
      sectionId: 4,
      title: "Overall Satisfaction"
    }
  ]

  const handleSelectOption = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value
    }))
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleNext = () => {
    if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }
  // Access the studentId from useStudent
  const { studentId } = useStudent()
  const handleSubmit = async () => {
    // Check for unanswered questions
    const unansweredQuestions = questions
      .filter((question) => !answers[question.id])
      .map((question) => question.message)

    if (unansweredQuestions.length > 0) {
      alert(
        `Please complete the following question(s):\n- ${unansweredQuestions.join("\n- ")}`
      )
      return // Exit if any questions are unanswered
    }

    if (!studentId) {
      console.error("No student ID found")
      return
    }
    // Step 1: Create a new feedback entry and get the feedback ID
    const feedbackId = await createFeedbackid(studentId)
    if (!feedbackId) {
      console.error("Failed to create feedback entry")
      return
    }

    // Prepare feedback data to send to the API

    const feedbackData = questions.map((q) => ({
      feedbackId,
      studentId,
      questionID: q.id, // Use the question ID from your form structure
      answer: answers[q.id], // Collect the user's answer as an integer (1-5)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

    try {
      // Call the API to create feedback
      const response = await createFeedback(feedbackData)
      console.log("Feedback successfully submitted:", response)
      setSubmitted(true) // Show thank-you message on success
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("There was an issue submitting your feedback. Please try again.")
    }
  }

  // Render thank you message if submitted
  if (submitted) {
    return (
      <div className="min-w-[1024px] bg-white rounded-lg shadow-md p-12 max-w-4xl mx-auto mt-10 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">
          Thank you for your feedback!
        </h1>
        <p className="text-gray-600">
          Thank you for taking the time to share your valuable feedback! We
          greatly appreciate it and carefully consider each response to improve
          our service.
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-[1024px] bg-white rounded-lg shadow-md p-12 max-w-4xl mx-auto mt-10 border border-gray-200">
      {/* Header */}
      <div className="mb-10 border-b border-gray-300 pb-4">
        <h2 className="text-3xl font-bold">Share your feedback</h2>
        <p className="text-gray-600">
          We value your opinions, take a little time to evaluate us.
        </p>
      </div>

      <div className="flex space-x-16">
        {/* Left Side: Progress Line */}
        <div className="flex w-35">
          <div
            className="space-y-10 border-r border-gray-300"
            style={{ paddingRight: "10px" }}>
            {sections.map((section, index) => (
              <Step
                key={index}
                label={section.sectionId}
                title={section.title}
                isActive={currentSection === index}
                isCompleted={
                  splitquestion[index] &&
                  splitquestion[index].every((q) => answers[q.id] !== undefined)
                }
                onClick={() => setCurrentSection(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Question Content */}
        <div className="w-65">
          <h1 className="text-2xl font-bold mb-4">
            {sections[currentSection].title}
          </h1>

          {Array.isArray(currentQuestions) && currentQuestions.length > 0 ? (
            currentQuestions.map((question) => (
              <div key={question.id} className="mb-5">
                <p className="text-lg mb-4" style={{ fontSize: "1rem" }}>
                  {question.message}
                </p>
                <OptionList
                  questionId={question.id}
                  selectedOption={answers[question.id]}
                  onSelect={handleSelectOption}
                />
              </div>
            ))
          ) : (
            <p>no questions</p>
          )}

          <div className="mt-10 flex justify-between">
            <Button onClick={handleBack} className="bg-gray-600 text-white">
              Back
            </Button>
            {currentSection < sections.length - 1 ? (
              <Button onClick={handleNext} className="bg-blue-600 text-white">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 text-white">
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step Component for progress line
function Step({ label, isActive, isCompleted, title, onClick }) {
  return (
    <div
      className="flex items-center space-x-6 cursor-pointer"
      onClick={onClick}>
      <div
        className={`flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${
          isActive
            ? "bg-blue-700 text-white h-12 w-12" // Active state - deep blue and larger
            : isCompleted
              ? "bg-blue-700 text-white h-10 w-10" // Completed state - light blue and smaller
              : "bg-gray-300 text-gray-600 h-10 w-10" // Default state - light grey
        }`}>
        {label}
      </div>
      <span
        className={`font-bold transition-all duration-300 ${
          isActive || isCompleted ? "text-blue-600" : "text-gray-600"
        }`}>
        {title}
      </span>
    </div>
  )
}

function ContactEmail() {
  return (
    <p
      className="bg-dcdcdc mb-auto "
      style={{
        position: "absolute",
        bottom: 0,
        fontSize: "calc(100% - 3px)",
        padding: "10px",
        paddingBottom: "20px"
      }}>
      For any issues or enquiries, please contact us at: rocky@ntu.edu.sg
    </p>
  )
}

// Main ContactUs component
function ContactUs() {
  return (
    <div>
      <FeedbackForm />
      <ContactEmail />
    </div>
  )
}

export default ContactUs
