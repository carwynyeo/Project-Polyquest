import { get, post } from "@/utils/api"

export interface AcadInterest {
  //id: number
  interestname: string
  //createdAt: string
  //updatedAt: number
  //studentacadinterest: string
  interested: boolean
  student_id: number
  interestName: string
}

// Create an acadInterest record
export const createAcadInterest = async (interest: AcadInterest[], studentId: number) => {
  try {
    // Prepare an array to hold the promises
    const interestPromises = interest.map(async (interest) => {
    const response = await post({
      url: `/student-acad-interest/student/${studentId}`, // Correct URL
      body: {
        interestName: interest.interestname, 
        interested: interest.interested,
        student_id: interest.student_id            
      },
      headers: {
        "Content-Type": "application/json" // Ensure correct content type
      }
    })

    // Handle success and errors
    if (!response.success) {
      console.error(`Failed to submit interest: ${response.error}`);
        throw new Error(response.error);
    }
  })

  // Wait for all promises to resolve
  await Promise.all(interestPromises);
  return true;
} catch (error) {
    console.error("Error creating interest:", error);
    return null;
  }
}

// Get a list of all acadInterest records
export const getAcadInterest = async () => {
  try {
    const response = await get<AcadInterest[]>({ url: "/acad-interest/get-all-acad-interests" })
    if (!response.success) throw new Error("Failed to load acadInterests")
    return response.data
  } catch (error) {
    console.error("Error fetching acadInterests:", error)
    return []
  }
}