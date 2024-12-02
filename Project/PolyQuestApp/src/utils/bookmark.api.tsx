import { get, post, del } from "@/utils/api" // Assuming 'del' is used for DELETE requests
export interface BookmarkCourse {
  id: number
  studentID: number
  course: number
  createdAt: Date
  updatedAt: Date
}

// Create a bookmark
export const createBookmark = async (studentID: number, courseId: number) => {
  const response = await post<BookmarkCourse>({
    url: "/bookmark",
    body: {
      studentId: studentID,
      courseId: courseId
    }
  })
  return response.success ? response.data : null
}

// Get a single student's bookmarks by student ID
export const getBookmarksByStudent = async (studentID: number) => {
  const response = await get<BookmarkCourse[]>({
    url: `/bookmark/student/${studentID}`
  })
  return response.success ? response.data : []
}

// Delete a bookmark by course ID
export const deleteBookmarkByStudent = async (
  studentID: number,
  courseID: number
) => {
  const response = await del({
    url: `/bookmark/student/${studentID}/course/${courseID}`
  })
  return response.success
}
