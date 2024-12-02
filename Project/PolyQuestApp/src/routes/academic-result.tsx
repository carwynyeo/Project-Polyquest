import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button, Select } from "@mantine/core"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { FiPlus, FiX } from "react-icons/fi" // Import icons for add/delete buttons
import { MdBlock } from "react-icons/md" // Import block icon
import {
  createAcadInterest,
  getAcadInterest,
  AcadInterest
} from "@/utils/apis/acadInterest.api"
import {
  createAcadResult,
  getAcadSubject,
  AcadResult
} from "@/utils/apis/acadResult.api"
import { useStudent } from "@/hooks/useStudent"
import { useTestState } from "@/hooks/useTestState"

export const Route = createFileRoute("/academic-result")({
  component: AcademicResultPage
})

const gradeOptions = ["A1", "A2", "B3", "B4", "C5", "C6", "D7", "E8", "F9"]

function AcademicResultPage() {
  const { setStatus } = useTestState()
  const [grades, setGrades] = useState<
    { subject: string; grade: string; editable: boolean }[]
  >([])
  const navigate = useNavigate()
  const [selectedInterests, setSelectedInterests] = useState<
    { interestName: string; selected: boolean }[]
  >([])
  const [interests, setInterests] = useState<AcadInterest[]>([]) // State to hold interests fetched from the API
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [subjectsAndGradesArray, setSubjectsAndGradesArray] = useState<
    { subject: string; grade: string }[]
  >([])
  const [electiveSubjects, setElectiveSubjects] = useState<AcadResult[]>([])
  const { studentId } = useStudent()
  console.log(studentId)

  useEffect(() => {
    const initializeTest = async () => {
      setStatus("ongoing")
    }
    initializeTest()
  }, [])

  // Load interests from the API
  const loadInterests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAcadInterest() // Fetch interests from the API
      if (data) {
        setInterests(data)
        console.log(data)
        // Initialize selectedInterests with false for each interest
        setSelectedInterests(
          data.map((interest) => ({
            interestName: interest.interestName,
            selected: false
          }))
        )
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

  // Load elective subjects from API
  const loadElectiveSubjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAcadSubject()
      if (data) {
        setElectiveSubjects(data)
        console.log(data)
      } else {
        setError("Failed to load elective subjects")
      }
    } catch (error) {
      console.error("Error loading elective subjects:", error)
      setError("Error loading elective subjects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadElectiveSubjects()
  }, [])

  // Update subjectsAndGradesArray whenever grades change
  useEffect(() => {
    const updatedArray = grades
      .filter((entry) => entry.subject && entry.grade) // Filter out incomplete entries
      .map((entry) => ({
        subject: entry.subject,
        grade: entry.grade
      }))
    setSubjectsAndGradesArray(updatedArray)
  }, [grades])

  useEffect(() => {
    loadInterests()
  }, [])

  const handleInterestClick = (interestName: string) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.map((interest) =>
        interest.interestName === interestName
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    )
  }

  // Load data from local storage or initialize with default values
  useEffect(() => {
    const storedData =
      JSON.parse(localStorage.getItem("academicResults") ?? "[]") || []
    if (storedData.length === 0) {
      const initialData = [
        { subject: "English", grade: "A1", editable: false },
        { subject: "Elementary Mathematics", grade: "A2", editable: false },
        ...Array(4).fill({ subject: "", grade: "", editable: true }) // Ensure minimum 6 rows
      ]
      setGrades(initialData)
    } else {
      setGrades(storedData)
    }
  }, [])

  // Load interests from local storage on mount
  useEffect(() => {
    const storedInterests =
      JSON.parse(localStorage.getItem("selectedInterests") ?? "[]") || []
    setSelectedInterests(storedInterests)
  }, [])

  // Save changes to local storage whenever grades change
  useEffect(() => {
    localStorage.setItem("academicResults", JSON.stringify(grades))
  }, [grades])

  // Save interests to local storage whenever selectedInterests changes
  useEffect(() => {
    localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests))
  }, [selectedInterests])

  const handleGradeChange = (index: number, value: string | null) => {
    if (value) {
      setGrades((prevGrades) =>
        prevGrades.map((entry, i) =>
          i === index ? { ...entry, grade: value } : entry
        )
      )
    }
  }

  const handleSubjectChange = (index: number, value: string | null) => {
    if (value) {
      setGrades((prevGrades) =>
        prevGrades.map((entry, i) =>
          i === index ? { ...entry, subject: value } : entry
        )
      )
    }
  }

  const addNewSubject = () => {
    setGrades((prevGrades) => [
      ...prevGrades,
      { subject: "", grade: "", editable: true }
    ])
  }

  const deleteRow = (index: number) => {
    if (grades.length > 6) {
      setGrades((prevGrades) => prevGrades.filter((_, i) => i !== index))
    } else {
      toast.error("Please provide at least 6 subjects")
    }
    toast.dismiss()
  }

  const availableSubjects = electiveSubjects.filter(
    (subject) => !grades.some((entry) => entry.subject === subject.subjectName)
  )

  const handleValidation = async () => {
    // Validation logic goes here
    if (grades.filter((grade) => grade.subject && grade.grade).length < 6) {
      toast.error("Please provide grades for at least 6 subjects")

      return
    }

    // Check selected Interest
    if (!selectedInterests.some((interest) => interest.selected)) {
      toast.error("Please select at least one interest")
      return
    }

    console.log("Updated Subjects and Grades Array:", subjectsAndGradesArray)
    console.log("Selected Interests:", selectedInterests)

    // TODO: send to backend API before navigation
    if (!studentId) {
      console.error("No student ID found")
      return
    }
    // Prepare academic results data to send to the API
    const academicResultsData = subjectsAndGradesArray.map((entry) => ({
      grade: entry.grade,
      student_id: studentId,
      subjectname: entry.subject,
      subjectName: entry.subject
    }))
    try {
      // Step 2: Send the academic results data to the backend
      await createAcadResult(academicResultsData, studentId)
      const interestData = selectedInterests.map((interest) => ({
        student_id: studentId,
        interestname: interest.interestName,
        interested: interest.selected,
        interestName: interest.interestName
      }))
      await createAcadInterest(interestData, studentId)
      //navigate({ to: "/test" }) // Navigate on success
    } catch (error) {
      console.error("Error submitting academic results:", error)
      toast.error(
        "There was an issue submitting your academic results. Please try again."
      )
    }

    // This means it's valid
    toast.dismiss()
    toast.success("Academic results and interests submitted successfully!")
    navigate({ to: "/test" })
  }

  return (
    <div>
      <div>
        <h1 className="flex text-2xl font-bold text-blue-950">
          Before you start, we need your academic results for the best accuracy!
        </h1>
        <h2 className="flex text-xl font-semibold text-center place-content-center my-6">
          Please key in your subjects and results
        </h2>
      </div>

      <div className="space-y-4 pb-4">
        <div className="flex justify-center">
          <div className="space-y-4">
            {grades.map((entry, index) => (
              <div
                key={index}
                className="flex space-x-4"
                style={{ width: "500px" }}>
                {/* Subject Dropdown */}
                <div className="flex-1">
                  <Select
                    data={
                      entry.editable
                        ? [
                            { value: entry.subject, label: entry.subject },
                            ...availableSubjects.map((subject) => ({
                              value: subject.subjectName,
                              label: subject.subjectName
                            }))
                          ]
                        : [{ value: entry.subject, label: entry.subject }]
                    }
                    value={entry.subject || ""}
                    onChange={(value) =>
                      entry.editable ? handleSubjectChange(index, value) : null
                    }
                    placeholder="Select subject"
                    className="w-full"
                  />
                </div>

                {/* Grade Dropdown */}
                <div className="w-36">
                  <Select
                    data={gradeOptions.map((grade) => ({
                      value: grade,
                      label: grade
                    }))}
                    value={entry.grade || ""}
                    onChange={(value) => handleGradeChange(index, value)}
                    placeholder="Select grade"
                  />
                </div>

                {/* Delete Button */}
                <div className="mt-2">
                  {entry.editable ? (
                    <button
                      onClick={() => deleteRow(index)}
                      className="text-red-500 hover:text-red-700">
                      <FiX size={16} />
                    </button>
                  ) : (
                    <MdBlock className="text-gray-500" size={16} />
                  )}
                </div>
              </div>
            ))}

            {/* Add Subject Button */}
            <div className="flex justify-center">
              <button
                onClick={addNewSubject}
                className="text-green-500 hover:text-green-700">
                <FiPlus size={20} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="flex text-xl font-semibold text-center place-content-center my-6">
            Click on your interest
          </h2>
          <p className="text-center text-sm mb-4">
            Please select at least 1 interest
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {loading && <p>Loading interest...</p>} {error && <p>{error}</p>}
          {selectedInterests.map((interest) => (
            <Button
              key={interest.interestName}
              variant={interest.selected ? "filled" : "outline"} // Switch between filled and outline
              color="rgba(63, 62, 254)"
              onClick={() => handleInterestClick(interest.interestName)}
              radius="lg">
              {interest.interestName}
            </Button>
          ))}
        </div>
        {/* Next Page Button */}
        <div className="flex justify-end mt-8 text-sm text-gray-700">
          <span onClick={() => handleValidation()} className="cursor-pointer">
            Next page
          </span>
        </div>
      </div>
    </div>
  )
}
