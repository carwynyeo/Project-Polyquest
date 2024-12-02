import { createAcadInterest, getAcadInterest} from "@/utils/apis/acadInterest.api";
import { get, post } from "@/utils/api";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Mock all functions from the API module
vi.mock("@/utils/api", () => ({
    get: vi.fn(),
    post: vi.fn(),
  }));

  describe("Academic Interest API Tests", () => {
    const studentId = 49; // Example student ID for testing
    const resultData = [{ interestname: "Languages", interested: true, student_id: studentId }]; // Example input for creating interest results
    const mockResult = { id: 1, interestName: "Languages", interested: true, student_id: studentId }; // Mocked response
    const mockInterestData = [
        { id: 1, interestName: "Languages", interested: true, student_id: studentId },
        { id: 2, interestName: "Mathematics", interested: false, student_id: studentId },
      ];

    beforeEach(() => {
        vi.clearAllMocks(); // Clear mocks before each test to prevent interference from previous tests
      });

    // Test for successful creation of interest record
    test("Create interest record - success", async () => {
        (post as vi.Mock).mockResolvedValue({ success: true, data: mockResult });
      
        const createdInterestRecord = await createAcadInterest(resultData, studentId); 
        expect(createdInterestRecord).toBe(true); // Expect `true` on success
        expect(post).toHaveBeenCalledTimes(resultData.length); 
      });

  // Test for failure case when creating interest record
  test("Create interest record - failure", async () => {
    (post as vi.Mock).mockResolvedValue({ success: false, error: "Failed to create interest" });
  
    const createdInterestRecord = await createAcadInterest(resultData, studentId);
    expect(createdInterestRecord).toBeNull(); // Expect `null` on failure
    expect(post).toHaveBeenCalledTimes(resultData.length); 
  });

  // Test for successfully fetching academic interests
  test("Get academic interests - success", async () => {
    // Mock a successful get response with interest data
    (get as vi.Mock).mockResolvedValue({ success: true, data: mockInterestData });

    const interests = await getAcadInterest(); // Fetch interest data
    expect(interests).toHaveLength(2); // Expect two interest records to be returned
    expect(interests[0].interestName).toBe("Languages"); // Check if the first interest name matches
    expect(interests[1].interestName).toBe("Mathematics"); // Check if the second interest name matches
  });

  // Test for failure case when fetching academic interests
  test("Get academic interests - failure", async () => {
    // Mock a failure response
    (get as vi.Mock).mockResolvedValue({ success: false });

    const interests = await getAcadInterest(); // Fetch interest data
    expect(interests).toEqual([]); // Expect an empty array to be returned on failure
  });
})