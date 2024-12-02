import { useTestState } from "@/hooks/useTestState"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Radio, Group, Stepper, rem, Progress } from "@mantine/core"
import { toast } from "sonner"
import {
  getQuestions,
  Question,
  createTestResult,
  TestResult,
  testId,
  createTestId,
  gettestId,
  updateTestComplete
} from "@/utils/apis/test.api"
import { useStudent } from "@/hooks/useStudent"
import test from "node:test"

export const Route = createFileRoute("/test")({
  component: TestPage
})

function TestPage() {
  const { setStatus } = useTestState()
  const [questions, setQuestions] = useState<Question[]>([])
  const [testId, setTestId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<
    { questionId: number; answer: number | null; testId?: number }[]
  >([])
  const { studentId } = useStudent()

  // Fetch questions from the API
  const loadQuestions = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getQuestions()
      if (data) {
        setQuestions(data)
        setAnswers(Array(data.length).fill(null)) // Initialize answers based on the number of questions
        console.log(data)
        // posting to API to get testid
        if (!studentId) {
          console.error("No student ID found")
          return
        }
        // Prepare studentid data to send to the API
        try {
          // Step 2: Send the studentid data to the backend
          await createTestId(studentId)
          const id = await gettestId(studentId)
          setTestId(id)
          //toast.success("TestId submitted successfully!")
          console.log(id)
          console.log("TestId submitted successfully!")
        } catch (error) {
          console.error("Error submitting testId:", error)
          //toast.error("There was an issue submitting your testId. Please try again.")
        }
      } else {
        setError("Failed to load questions")
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      setError("Error loading questions")
    } finally {
      setLoading(false)
    }
  }

  // get testId
  const loadTestId = async () => {
    try {
      const id = await gettestId(studentId)
      if (id !== null) {
        setTestId(id)
        // Log after state update is scheduled
        console.log("testid")
        console.log(id) // Logs the newly fetched ID
      } else {
        console.error("No test ID found")
      }
    } catch (error) {
      console.error("Error loading test ID:", error)
    }
  }

  useEffect(() => {
    const initializeTest = async () => {
      setStatus("ongoing")
      await loadQuestions() // Load questions first
      await loadTestId
    }
    initializeTest()
  }, [])

  useEffect(() => {
    if (questions.length) {
      setAnswers(questions.map((q) => ({ questionId: q.id, answer: null })))
    }
  }, [questions])

  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const questionsPerPage = 5
  const pageCount = Math.ceil(questions.length / questionsPerPage)

  const handleSelect = (questionIndex: number, value: number) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, index) =>
        index === questionIndex ? { ...answer, answer: value } : answer
      )
    )
  }

  const handlePage = async (direction: "next" | "prev") => {
    const startIndex = page * questionsPerPage
    const endIndex = startIndex + questionsPerPage
    const currentAnswers = answers.slice(startIndex, endIndex)
    const allAnswered = currentAnswers.every((answer) => answer.answer !== null)

    if (direction === "next" && allAnswered) {
      if (page === pageCount - 1) {
        {
          if (!testId) {
            console.error("Test ID is not available")
            //toast.error("Test ID is not available")
            return
          }
          // posting to API for response
          if (!studentId) {
            console.error("No student ID found")
            return
          }
          try {
            await Promise.all(
              answers.map(async ({ questionId, answer }) => {
                if (answer !== null) {
                  await createTestResult(testId!, questionId, answer)
                }
              })
            )
            // mark test as complete
            const istestComplete = true
            await updateTestComplete(testId, istestComplete)
            console.log("Test marked as complete!")
            toast.success("Test results submitted successfully!")
          } catch (error) {
            console.error("Error submitting test results:", error)
            toast.error(
              "There was an issue submitting your test results. Please try again."
            )
          }
        }
        setStatus("completed")
        navigate({ to: "/" })
      } else {
        setPage(page + 1)
      }
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1)
    } else if (direction === "next" && !allAnswered) {
      toast.error("Please answer all questions")
      return
    }
    toast.dismiss()
    console.log(answers)
  }

  const getCompletionPercentage = () => {
    const startIndex = page * questionsPerPage
    const endIndex = startIndex + questionsPerPage
    const currentAnswers = answers.slice(startIndex, endIndex)
    const answeredCount = currentAnswers.filter(
      (answer) => answer !== null && answer.answer !== null
    ).length
    return (answeredCount / questionsPerPage) * 100
  }

  return (
    <div>
      {/* <div className="flex justify-between text-sm text-gray-700 ">
        <Link to="/academic-result">Back to academic results</Link>
      </div> */}
      <h1 className="py-5 text-2xl font-bold text-blue-950 tracking-wide">
        Take a quiz to find out more about yourself
      </h1>

      {/* Stepper Component */}
      <div className="pb-5">
        <Stepper
          active={page}
          size="xs"
          styles={{
            stepBody: { cursor: "default" },
            step: { padding: 0 },
            stepIcon: { borderWidth: rem(3) },
            separator: {
              marginLeft: rem(5),
              marginRight: rem(5),
              height: rem(4)
            }
          }}>
          {[...Array(pageCount)].map((_, index) => (
            <Stepper.Step key={index} allowStepSelect={false} />
          ))}
        </Stepper>
      </div>

      {/* Render questions for the current page */}
      <div>
        {loading && <p>Loading questions...</p>} {error && <p>{error}</p>}
        {/* Loading State */}
        {questions
          .slice(page * questionsPerPage, (page + 1) * questionsPerPage)
          .map((q, index) => {
            const questionIndex = page * questionsPerPage + index
            return (
              <div
                key={q.id}
                className="bg-white p-5 mb-5 rounded-lg shadow-transparent border border-blue-500">
                <h3 className="font-sans text-sm font-semibold text-blue-800">
                  <span className="mr-2">{questionIndex + 1}.</span>{" "}
                  {q.questionText}
                </h3>

                {/* Radio Group for each question */}
                <Radio.Group
                  name={`question-${questionIndex}`}
                  label=""
                  description=""
                  value={answers[questionIndex]?.answer?.toString() || ""}
                  onChange={(value: string) =>
                    handleSelect(questionIndex, parseInt(value))
                  }
                  className="mt-4">
                  <Group mt="xs">
                    <Radio value="1" label="Strongly Disagree" />
                    <Radio value="2" label="Disagree" />
                    <Radio value="3" label="Neutral" />
                    <Radio value="4" label="Agree" />
                    <Radio value="5" label="Strongly Agree" />
                  </Group>
                </Radio.Group>
              </div>
            )
          })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="text-blue-800 text-sm"
          onClick={() => handlePage("prev")}
          disabled={page === 0}>
          Previous
        </button>
        {/* Progress Bar */}
        <Progress
          value={getCompletionPercentage()}
          animated
          className="flex-1 mx-4"
        />
        <button
          className="text-blue-800 text-sm"
          onClick={() => handlePage("next")}>
          {page === pageCount - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  )
}
