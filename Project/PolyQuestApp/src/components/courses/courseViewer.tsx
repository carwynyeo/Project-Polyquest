import { Modal, Button, Badge, ActionIcon } from "@mantine/core"
import { Course } from "@/utils/courses.api" // Adjust the path as needed
import { FiMapPin, FiX } from "react-icons/fi"

interface CourseViewerProps {
  course: Course | null
  opened: boolean
  onClose: () => void
}

const CourseViewer = ({ course, opened, onClose }: CourseViewerProps) => {
  if (!course) return null

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="90%"
      centered
      withCloseButton={false} // Remove default close button
      overlayProps={{
        opacity: 0.55
      }}
      styles={{
        inner: { padding: 0 }, // Styles for the inner part of the modal
        content: { padding: 0, margin: 0 } // Styles for the content part of the modal
      }}>
      <div className="flex flex-row">
        {/* Left side - Course description */}
        <div className="bg-gray-100 p-8 w-1/2">
          <div className="mb-4">
            <h2 className="text-indigo-800 text-3xl font-bold">
              {course.courseName}
            </h2>
            <div className="flex items-center text-gray-600 mt-2 text-sm">
              <FiMapPin className="mr-1" />
              <span>{course.schoolName}</span>
            </div>
          </div>
          <p className="text-gray-700 text-base whitespace-pre-wrap">
            {course.courseDescription}
          </p>
        </div>

        {/* Right side - Career Prospects, Key Skills, and Close Button */}
        <div className="p-8 w-1/2 bg-white relative">
          {/* Close Button in the top-right corner of the right component */}
          <ActionIcon
            onClick={onClose}
            className="absolute bottom-6 left-full text-gray-500 hover:text-gray-800"
            size="lg"
            variant="transparent">
            <FiX size={20} />
          </ActionIcon>

          {/* Career Prospects */}
          <div className="-mt-8">
            <div className="border-b-2 pb-2 mb-4">
              <h3 className="text-xl font-semibold text-indigo-900">
                Career Prospects
              </h3>
            </div>
            <ul className="list-disc ml-6 text-gray-700">
              {course.careerProspect.map((prospect, index) => (
                <li key={index}>{prospect}</li>
              ))}
            </ul>
          </div>

          {/* Key Skills */}
          <div className="mt-8">
            <div className="border-b-2 pb-2 mb-4">
              <h3 className="text-xl font-semibold text-indigo-900">
                Key Skills Learned
              </h3>
            </div>
            <ul className="list-disc ml-6 text-gray-700">
              {course.keySkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Link Button
          <Button
            fullWidth
            className="mt-8 bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={() => window.open(course.link)}>
            Link To Course Page
          </Button> */}
        </div>
      </div>
    </Modal>
  )
}

export default CourseViewer
