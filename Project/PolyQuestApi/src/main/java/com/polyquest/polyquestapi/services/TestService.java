package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Recommendation;
import com.polyquest.polyquestapi.model.Response;
import com.polyquest.polyquestapi.model.Test;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.dto.TestReq;
import com.polyquest.polyquestapi.repository.TestRepository;
import com.polyquest.polyquestapi.repository.ResponseRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class TestService {

    private final TestRepository testRepository;
    private final ResponseRepository responseRepository;  // Add ResponseRepository
    private final StudentRepository studentRepository;

    @Autowired
    public TestService(TestRepository testRepository,
                       ResponseRepository responseRepository,
                       StudentRepository studentRepository) {
        this.testRepository = testRepository;
        this.responseRepository = responseRepository;
        this.studentRepository = studentRepository;
    }

    // Get all tests for a student by studentId
    public Iterable<Test> getAllTestsByStudent(Integer studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            return testRepository.findByStudent(student);
        }
        return null;  // Return null if student not found
    }

    // Convert Test to TestDTO
    private TestReq convertToTestDTO(Test test) {
        TestReq dto = new TestReq();
        dto.setId(test.getId());
        dto.setTestComplete(test.isTestcomplete());
        dto.setCreatedAt(test.getCreatedAt());
        dto.setUpdatedAt(test.getUpdatedAt());
        return dto;
    }

    // Retrieve the latest test for a student and convert to TestDTO
    public TestReq getLatestTest(int studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            Test latestTest = testRepository.findLatestTestByStudent(studentId);
            return latestTest != null ? convertToTestDTO(latestTest) : null;
        }
        return null;
    }
    // Create a new test for a student
    public Test createTest(Integer studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            Test test = new Test();
            test.setStudent(student);  // Associate the test with a student
            test.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            test.setTestcomplete(false);
            return testRepository.save(test);
        }
        return null;  // Return null if student not found
    }

    // Delete a test by test ID
    public boolean deleteTest(Integer id) {
        try {
            testRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Test with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Test with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    // Update a test by test ID
    public Test updateTest(Integer testId, Test updatedTest) {
        if (testRepository.existsById(testId)) {
            updatedTest.setId(testId);
            updatedTest.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            return testRepository.save(updatedTest);
        }
        return null;  // Return null if the test does not exist
    }

    // Save responses for a test
    public boolean saveResponses(Integer testId, List<Response> responses) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test != null && responses != null && !responses.isEmpty()) {
            for (Response response : responses) {
                response.setTest(test);  // Associate responses with the test
            }
            responseRepository.saveAll(responses);
            return true;
        }
        return false;  // Return false if test not found or responses are empty
    }

    // Check if a test is complete
    public boolean isTestComplete(Integer testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test != null) {
            return test.isTestcomplete();
        }
        return false;  // Return false if test not found
    }

    // Set a test as complete by test ID
    public boolean setTestComplete(Integer testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test != null) {
            test.setTestcomplete(true);  // Set the test as complete
            test.setUpdatedAt(new Timestamp(System.currentTimeMillis()));  // Update the timestamp
            testRepository.save(test);  // Save the updated test
            return true;
        }
        return false;  // Return false if test not found
    }


    // Generate recommendation based on a test
    public Recommendation generateRecommendation(Integer testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test != null && test.isTestcomplete()) {
            return createRecommendationFromTest(test);  // Generate and return recommendation
        }
        return null;  // Return null if test not found or incomplete
    }

    // Helper method to generate a recommendation based on the test
    private Recommendation createRecommendationFromTest(Test test) {
        Recommendation recommendation = new Recommendation();
        // Fix: Set the Test object instead of testId
        recommendation.setTest(test);  // Pass the entire Test object
        // Logic to populate other fields (e.g., score, courses)
        // recommendation.setRecommendationScore(calculateScore(test));
        return recommendation;
    }

}
