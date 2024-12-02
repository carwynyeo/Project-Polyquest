import { useState, useEffect, useContext } from "react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Modal, Select, Button, Alert, PasswordInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications" // Import showNotification
import { IoIosArrowForward } from "react-icons/io"
import { FiX, FiPlus } from "react-icons/fi" // Feather Icon for delete button
import { MdBlock } from "react-icons/md" // Material Icon for stop sign
import { AuthContext } from "@/context/auth-context"
import { fbAuth } from "@/utils/firebase"
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import {
  createAcadResult,
  getAcadResult,
  updateAcadResult,
  getAcadSubject,
  deleteAcadResult
} from "@/utils/apis/acadResult.api"
import { useStudent } from "@/hooks/useStudent"
import {
  getStudent,
  updateStudent,
  deleteStudent
} from "@/utils/apis/student.api"

// Define the route
export const Route = createFileRoute("/settings")({
  component: Settings
})

// Reusable Modal Header Component
function ModalHeader({
  title,
  subTitle,
  onClose
}: {
  title: string
  subTitle: string
  onClose: () => void
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2 text-gray-600 text-sm font-semibold">
        <span>Settings</span>
        <IoIosArrowForward />
        <span>{subTitle}</span>
      </div>
      <button
        className="text-gray-600 hover:text-black text-2xl -mt-1"
        onClick={onClose}
        aria-label="Close Modal">
        &times;
      </button>
    </div>
  )
}

// Reusable Modal Component
function SettingsModal({
  opened,
  onClose,
  title,
  content
}: {
  opened: boolean
  onClose: () => void
  title: string
  content: React.ReactNode
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      centered
      withCloseButton={false}
      padding="lg"
      radius="lg"
      aria-labelledby="modal-title"
      aria-describedby="modal-content">
      <ModalHeader subTitle={title} onClose={onClose} title={""} />
      <h2 id="modal-title" className="text-2xl font-bold mt-4 mb-4">
        {title}
      </h2>
      <div id="modal-content">{content}</div>
    </Modal>
  )
}

function PersonalInfoContent() {
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [authMethod, setAuthMethod] = useState<string | null>(null) // State for authMethod
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { studentId } = useStudent()

  // Fetch user data and authMethod
  useEffect(() => {
    const user = fbAuth.currentUser
    if (user) {
      const displayName =
        user.displayName ?? user.email?.split("@")[0].toLowerCase()
      setName(displayName)
      setEmail(user.email || "")
    }

    async function fetchAuthMethod() {
      try {
        const studentData = await getStudent(studentId)
        setAuthMethod(studentData.authMethod) // Set the authMethod
      } catch (error) {
        console.error("Failed to fetch student data:", error)
      }
    }

    if (studentId) {
      fetchAuthMethod()
    }
  }, [studentId])

  const handleSaveNameClick = async () => {
    const user = fbAuth.currentUser
    if (user && newName) {
      try {
        await user.updateProfile({ displayName: newName })
        setName(newName)
        setSuccessMessage("Name updated successfully!")
      } catch (error) {
        setErrorMessage("Failed to update name. Please try again.")
      }
    }
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!oldPassword) newErrors.oldPassword = "Old password is required."
    if (!newPassword) newErrors.newPassword = "New password is required."
    else {
      if (newPassword.length < 8)
        newErrors.newPassword = "Password must be at least 8 characters long."
      if (!/[A-Z]/.test(newPassword))
        newErrors.newPassword =
          "Password must contain at least one uppercase letter."
      if (!/[a-z]/.test(newPassword))
        newErrors.newPassword =
          "Password must contain at least one lowercase letter."
      if (!/[0-9]/.test(newPassword))
        newErrors.newPassword = "Password must contain at least one number."
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword))
        newErrors.newPassword = "Password must contain at least one symbol."
    }
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your new password."
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSavePasswordClick = async () => {
    if (!validate()) return

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const user = fbAuth.currentUser
      if (!user) {
        setErrorMessage("No user is signed in.")
        setIsLoading(false)
        return
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      // Retrieve the latest student data
      const currentStudentData = await getStudent(studentId)
      if (!currentStudentData)
        throw new Error("Failed to retrieve student data.")

      // Update the password field in the student data
      const updatedStudent = {
        ...currentStudentData,
        password: newPassword,
        updatedAt: new Date()
      }

      // Use updateStudent to save the modified data with the new password
      const dbResponse = await updateStudent(updatedStudent)
      if (!dbResponse)
        throw new Error("Failed to update student data in the backend.")

      setSuccessMessage("Password updated successfully!")
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordVisible(false)

      setTimeout(() => setSuccessMessage(""), 5000)
      console.log(updatedStudent)
    } catch (error) {
      setErrorMessage(
        error.message || "Failed to update password. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 text-sm pb-4">
      {successMessage && (
        <Alert title="Success" color="green" withCloseButton className="mt-4">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert title="Error" color="red" withCloseButton className="mt-4">
          {errorMessage}
        </Alert>
      )}

      {/* Display Name */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-1">
        <div>
          <label className="block text-gray-600 font-semibold">Name</label>
          {name ? (
            <p className="mt-1 text-gray-500">{name}</p>
          ) : (
            <div className="mt-1">
              <input
                type="text"
                placeholder="Enter your name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
              <Button
                onClick={handleSaveNameClick}
                className="bg-blue-500 hover:bg-blue-600 text-white mx-auto block mt-2">
                Save Name
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Display Email */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-1">
        <div>
          <label className="block text-gray-600 font-semibold">
            Email address
          </label>
          <p className="mt-1 text-gray-500">{email}</p>
        </div>
        <span className="text-green-600 font-bold">Verified</span>
      </div>

      {/* Password Section - only show if authMethod is not 'google' */}
      {authMethod !== "google" && (
        <div className="border-b border-gray-300 pb-3 mb-1">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <label className="block text-gray-600 font-semibold">
                Password
              </label>
              <p className="text-gray-500">{"*".repeat(10)}</p>
            </div>
            <span
              onClick={() => setPasswordVisible(!isPasswordVisible)}
              className="text-blue-500 font-medium text-sm cursor-pointer">
              {isPasswordVisible ? "Back" : "Change"}
            </span>
          </div>
        </div>
      )}

      {/* Password Change Inputs - only show if authMethod is not 'google' */}
      {authMethod !== "google" && isPasswordVisible && (
        <div className="space-y-4 mt-6">
          <div className="space-y-1">
            <PasswordInput
              label="Old Password"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.currentTarget.value)}
              error={errors.oldPassword}
              classNames={{ input: "border border-gray-300" }}
            />
          </div>

          <div className="space-y-1">
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              error={errors.newPassword}
              classNames={{ input: "border border-gray-300" }}
            />
          </div>

          <div className="space-y-1">
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              error={errors.confirmPassword}
              classNames={{ input: "border border-gray-300" }}
            />
          </div>

          <Button
            onClick={handleSavePasswordClick}
            className="bg-blue-500 hover:bg-blue-600 text-white mx-auto block mt-6"
            disabled={isLoading}
            loading={isLoading}>
            Save Password
          </Button>
        </div>
      )}
    </div>
  )
}

// let studentId = 52;

// export const deleteAllAcadResults = async () => {
//   try {
//     // Fetch all academic results for the student
//     const results = await getAcadResult(studentId);

//     // Check if there are any results to delete
//     if (results.length === 0) {
//       console.log(`No academic results found for student ID: ${studentId}`);
//       return;
//     }

//     // Delete each result by its ID
//     await Promise.all(
//       results.map(async (result) => {
//         await deleteAcadResult(result.id);
//         console.log(`Deleted result with ID: ${result.id}`);
//       })
//     );

//     console.log(`All academic results deleted for student ID: ${studentId}`);
//   } catch (error) {
//     console.error("Error deleting all academic results:", error);
//   }
// };

// deleteAllAcadResults()

const gradeOptions = ["A1", "A2", "B3", "B4", "C5", "C6", "D7", "E8", "F9"]

const coreSubjects = [
  { subject: "English", grade: "", editable: false },
  { subject: "Elementary Mathematics", grade: "", editable: false }
]

function AcademicResultsContent() {
  const [grades, setGrades] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [error, setError] = useState("") // Initialize error state
  const { studentId } = useStudent()

  useEffect(() => {
    async function fetchSubjects() {
      const subjects = await getAcadSubject()
      const electiveSubjects = subjects
        .map((subject) => subject.subjectName)
        .filter(
          (subject) => !coreSubjects.some((core) => core.subject === subject)
        )
      setAvailableSubjects(electiveSubjects)
    }
    fetchSubjects()
  }, [])

  useEffect(() => {
    async function fetchResults() {
      const savedResults = await getAcadResult(studentId)

      const coreResults = coreSubjects.map((core) => {
        const found = savedResults.find(
          (result) => result.subjectName === core.subject
        )
        return found
          ? {
              id: found.id,
              subject: found.subjectName,
              grade: found.grade,
              editable: false
            }
          : { subject: core.subject, grade: "", editable: false }
      })

      const electiveResults = savedResults
        .filter(
          (result) =>
            !coreSubjects.some((core) => core.subject === result.subjectName)
        )
        .map((result) => ({
          id: result.id,
          subject: result.subjectName,
          grade: result.grade,
          editable: true
        }))

      setGrades([...coreResults, ...electiveResults])
    }
    fetchResults()
  }, [studentId])

  const handleSubjectChange = async (index, value) => {
    const updatedEntry = grades[index]
    const updatedGrades = grades.map((entry, i) =>
      i === index ? { ...entry, subject: value, grade: "" } : entry
    )
    setGrades(updatedGrades)

    // Update the backend if there's an ID
    if (updatedEntry.id) {
      try {
        await updateAcadResult(updatedEntry.id, studentId, {
          subjectName: value,
          grade: updatedEntry.grade
        })
        console.log(
          `Subject updated to ${value} for entry ID ${updatedEntry.id}`
        )
      } catch (error) {
        console.error("Error updating subject:", error)
      }
    }
  }

  const handleGradeChange = async (index, value) => {
    const updatedEntry = grades[index]

    if (!updatedEntry.subject) {
      console.warn("Please select a subject before choosing a grade.")
      return
    }

    const updatedGrades = grades.map((entry, i) =>
      i === index ? { ...entry, grade: value } : entry
    )
    setGrades(updatedGrades)

    if (!updatedEntry.id) {
      try {
        await createAcadResult(
          [
            {
              subjectname: updatedEntry.subject,
              grade: value,
              student_id: studentId
            }
          ],
          studentId
        )

        const savedResults = await getAcadResult(studentId)

        const coreResults = coreSubjects.map((core) => {
          const found = savedResults.find(
            (result) => result.subjectName === core.subject
          )
          return found
            ? {
                id: found.id,
                subject: found.subjectName,
                grade: found.grade,
                editable: false
              }
            : { subject: core.subject, grade: "", editable: false }
        })

        const electiveResults = savedResults
          .filter(
            (result) =>
              !coreSubjects.some((core) => core.subject === result.subjectName)
          )
          .map((result) => ({
            id: result.id,
            subject: result.subjectName,
            grade: result.grade,
            editable: true
          }))

        setGrades([...coreResults, ...electiveResults])
        console.log("Grades updated with new entry ID")
      } catch (error) {
        console.error("Error creating academic result:", error)
      }
    } else {
      try {
        await updateAcadResult(updatedEntry.id, studentId, {
          subjectName: updatedEntry.subject,
          grade: value
        })
        console.log(`Grade updated for ${updatedEntry.subject} to ${value}`)
      } catch (error) {
        console.error("Error updating academic result:", error)
      }
    }
  }

  const addNewSubject = () => {
    setGrades((prevGrades) => [
      ...prevGrades,
      { subject: "", grade: "", editable: true }
    ])
  }

  // Updated deleteRow function with an arrow function in onClick handler
  const deleteRow = async (index) => {
    if (grades.length <= 6) {
      setError("Error. You must have at least 6 subjects.")
      setTimeout(() => setError(""), 3000)
      return
    }

    const entryToDelete = grades[index]

    if (entryToDelete.id) {
      try {
        await deleteAcadResult(entryToDelete.id)
        setGrades((prevGrades) => prevGrades.filter((_, i) => i !== index))
        console.log(`Deleted entry with ID ${entryToDelete.id}`)
      } catch (error) {
        console.error("Failed to delete result:", error)
        setError("Error deleting result. Please try again.")
        setTimeout(() => setError(""), 3000)
      }
    } else {
      setGrades((prevGrades) => prevGrades.filter((_, i) => i !== index))
      console.log("Deleted unsaved entry from UI")
    }
  }

  const filteredSubjects = availableSubjects.filter(
    (subject) => !grades.some((entry) => entry.subject === subject)
  )

  return (
    <div className="space-y-4 pb-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {grades.map((entry, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-1">
            <Select
              data={
                entry.editable
                  ? [
                      { value: entry.subject, label: entry.subject },
                      ...filteredSubjects.map((subject) => ({
                        value: subject,
                        label: subject
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

          <div className="w-32">
            <Select
              data={gradeOptions.map((grade) => ({
                value: grade,
                label: grade
              }))}
              value={entry.grade || ""}
              onChange={(value) => handleGradeChange(index, value)}
              placeholder="Select grade"
              disabled={!entry.subject}
              className={`w-full ${!entry.subject ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
            />
          </div>

          <div>
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
      <div className="flex justify-center">
        <button
          onClick={addNewSubject}
          className="text-green-500 hover:text-green-700">
          <FiPlus size={20} />
        </button>
      </div>
    </div>
  )
}

function DeleteAccountContent({ onClose }: { onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [authMethod, setAuthMethod] = useState<string | null>(null) // New state for authMethod
  const router = useRouter()
  const { signOut } = useContext(AuthContext)
  const { studentId } = useStudent() // Assuming `studentId` is available from this hook

  useEffect(() => {
    async function fetchAuthMethod() {
      try {
        const studentData = await getStudent(studentId)
        setAuthMethod(studentData.authMethod) // Set the authMethod
      } catch (error) {
        console.error("Failed to fetch student data:", error)
      }
    }

    if (studentId) {
      fetchAuthMethod()
    }
  }, [studentId])

  const handleDeleteAccount = async () => {
    setErrorMessage("")

    // For non-Google users, require password confirmation
    if (authMethod == "email" && !confirmPassword) {
      setErrorMessage("Please enter your password to confirm.")
      return
    }

    setIsDeleting(true)

    try {
      const user = fbAuth.currentUser
      if (!user) {
        setErrorMessage("No user is signed in.")
        setIsDeleting(false)
        return
      }

      // Re-authenticate for Google users if `authMethod` is "google"
      if (authMethod === "google") {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(fbAuth, provider)
      } else {
        // For non-Google users, re-authenticate with password
        const credential = EmailAuthProvider.credential(
          user.email!,
          confirmPassword
        )
        await reauthenticateWithCredential(user, credential)
      }

      // Proceed with account deletion
      await deleteUser(user)

      deleteStudent(studentId)

      // Show success notification
      showNotification({
        title: "Success",
        message: "Your account has been successfully deleted.",
        color: "green",
        autoClose: 3000,
        disallowClose: true
      })

      onClose()
      signOut()
      router.navigate({ to: "/sign-in" })
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to delete the account.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4 pb-4">
      {errorMessage && (
        <Alert title="Error" color="red" withCloseButton>
          {errorMessage}
        </Alert>
      )}
      <p className="text-red-500 text-xl font-semibold">This action cannot be reversed</p>
      <p className="text-gray-500">
        Please enter your password for confirmation.
      </p>

      {/* Conditionally render PasswordInput if authMethod is not 'google' */}
      {authMethod == "email" && (
        <div className="mt-4">
          <PasswordInput
            label="Confirm Password"
            placeholder="Enter your password to confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
        </div>
      )}

      <button
        onClick={handleDeleteAccount}
        disabled={isDeleting}
        className={`w-full py-2 mt-4 rounded-lg transition-transform duration-300 transform 
          ${
            isDeleting
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:scale-105 hover:bg-red-700 text-white"
          }`}>
        {isDeleting ? "Deleting..." : "Delete my account"}
      </button>
    </div>
  )
}

// Main Settings Component
function Settings() {
  const [modalInfo, setModalInfo] = useState<{
    open: boolean
    title: string
    content: React.ReactNode
  }>({ open: false, title: "", content: null })
  const { studentId } = useStudent()
  const [hasResults, setHasResults] = useState(false) // New state to check if results exist

  const openModal = (title: string, content: React.ReactNode) => {
    setModalInfo({ open: true, title, content })
  }

  const closeModal = () => {
    setModalInfo({ open: false, title: "", content: null })
  }

  useEffect(() => {
    async function checkForResults() {
      try {
        const results = await getAcadResult(studentId)
        setHasResults(results.length > 0) // Update `hasResults` if there are results
      } catch (error) {
        console.error("Error checking academic results:", error)
      }
    }

    if (studentId) {
      checkForResults()
    }
  }, [studentId])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-10">Settings</h1>

      <div
        className="grid gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
        }}>
        {/* Personal Info Card */}
        <div
          className="relative bg-white shadow p-8 h-48 rounded-lg cursor-pointer hover:scale-105 transform transition-transform duration-300 hover:shadow-lg"
          onClick={() => openModal("Personal Info", <PersonalInfoContent />)}>
          <h2 className="text-xl font-bold mb-4">Personal Info</h2>
          <p>Provide personal information and update academic results.</p>
          <div className="absolute bottom-4 right-6">
            <IoIosArrowForward size={24} className="text-blue-500" />
          </div>
        </div>

        {/* Academic Results Card */}
        <div
          className={`relative bg-white shadow p-8 h-48 rounded-lg cursor-pointer 
                    ${hasResults ? "hover:scale-105" : "opacity-50 cursor-not-allowed"} 
                    transform transition-transform duration-300 hover:shadow-lg`}
          onClick={() =>
            hasResults &&
            openModal("Academic Results", <AcademicResultsContent />)
          }
          title={!hasResults ? "You need to complete a test first" : ""}>
          <h2 className="text-xl font-bold mb-4">
            Academic Results & Interests
          </h2>
          <p>Edit your academic results anytime.</p>
          <div className="absolute bottom-4 right-6">
            <IoIosArrowForward
              size={24}
              className={`text-blue-500 ${hasResults ? "" : "opacity-50"}`}
            />
          </div>
        </div>

        {/* Delete Account Card */}
        <div
          className="relative bg-white shadow p-8 h-48 rounded-lg cursor-pointer hover:scale-105 transform transition-transform duration-300 hover:shadow-lg"
          onClick={() =>
            openModal(
              "Delete Account",
              <DeleteAccountContent onClose={closeModal} />
            )
          }>
          <h2 className="text-xl font-bold mb-4">Delete Account</h2>
          <p>You have the option to delete your account at any time.</p>
          <div className="absolute bottom-4 right-6">
            <IoIosArrowForward size={24} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <SettingsModal
        opened={modalInfo.open}
        onClose={closeModal}
        title={modalInfo.title}
        content={modalInfo.content}
      />
    </div>
  )
}

export default Settings
